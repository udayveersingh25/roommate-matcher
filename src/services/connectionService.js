import { db } from "./firebase";
import { collection, doc, addDoc, getDocs, updateDoc, query, where, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Sends a connection invite from current user to target user
 */
export async function sendInvite(fromUserId, toUser) {
    // 1. Check for existing invites to prevent duplicates
    const invitesRef = collection(db, "invites");
    // Check if there's any invite from me to them
    const q1 = query(invitesRef, where("fromUserId", "==", fromUserId), where("toUserId", "==", toUser.id));
    const snap1 = await getDocs(q1);
    
    // Check if there's any invite from them to me
    const q2 = query(invitesRef, where("fromUserId", "==", toUser.id), where("toUserId", "==", fromUserId));
    const snap2 = await getDocs(q2);

    if (!snap1.empty || !snap2.empty) {
        throw new Error("An invite already exists between you and this user.");
    }

    // 2. Create the invite
    await addDoc(invitesRef, {
        fromUserId,
        toUserId: toUser.id,
        status: "pending",
        createdAt: serverTimestamp()
    });

    // 3. Trigger Serverless Function for Email processing (Temporarily disabled)
    /*
    try {
        const response = await fetch("/api/send-invite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: toUser.email,
                toName: toUser.fullName || toUser.email.split("@")[0]
            })
        });
        
        if (!response.ok) {
            console.warn("Failed to dispatch Resend email payload via Serverless API.");
        }
    } catch (e) {
        console.error("Network Error calling /api/send-invite:", e);
    }
    */
}

/**
 * Unsends (deletes) a pending invite by matching the sender and receiver IDs
 */
export async function unsendInviteByUsers(fromUserId, toUserId) {
    const invitesRef = collection(db, "invites");
    const q = query(
        invitesRef, 
        where("fromUserId", "==", fromUserId), 
        where("toUserId", "==", toUserId),
        where("status", "==", "pending")
    );
    const snap = await getDocs(q);
    
    if (snap.empty) throw new Error("No pending invite found to unsend.");
    
    for (const docSnapshot of snap.docs) {
        await deleteDoc(docSnapshot.ref);
    }
}

/**
 * Unsends (deletes) a pending invite via exactly known invite ID
 */
export async function unsendInviteById(inviteId) {
    const inviteRef = doc(db, "invites", inviteId);
    await deleteDoc(inviteRef);
}

/**
 * Fetches invites where user is sender or receiver
 */
export async function getUserInvites(userId) {
    const invitesRef = collection(db, "invites");
    
    // Incoming
    const qIncoming = query(invitesRef, where("toUserId", "==", userId));
    const snapIncoming = await getDocs(qIncoming);
    
    // Outgoing
    const qOutgoing = query(invitesRef, where("fromUserId", "==", userId));
    const snapOutgoing = await getDocs(qOutgoing);

    const incoming = snapIncoming.docs.map(d => ({ id: d.id, ...d.data() }));
    const outgoing = snapOutgoing.docs.map(d => ({ id: d.id, ...d.data() }));

    return { incoming, outgoing };
}

/**
 * Accept / Decline Invite
 * Only receiver should call this.
 */
export async function respondToInvite(inviteId, status, currentUserId, senderUserId) {
    const inviteRef = doc(db, "invites", inviteId);
    await updateDoc(inviteRef, {
        status: status
    });

    if (status === "accepted") {
        // Create connection for the receiver ONLY (bidirectional sync handles the sender later)
        const connRef = doc(db, `connections/${currentUserId}/userConnections`, senderUserId);
        await setDoc(connRef, {
            connectedUserId: senderUserId,
            createdAt: serverTimestamp()
        }, { merge: true });
    }
}

/**
 * Fetch accepted connections and enforce Sync Rule
 */
export async function fetchAndSyncConnections(userId) {
    // 1. Fetch current connections
    const userConnsRef = collection(db, `connections/${userId}/userConnections`);
    const connSnap = await getDocs(userConnsRef);
    const existingConnections = new Set(connSnap.docs.map(d => d.id));

    // 2. Fetch all invites to check for synchronization
    const { incoming, outgoing } = await getUserInvites(userId);
    
    let createdNewSync = false;

    // Check outgoing invites that are "accepted" but missing in local connections
    for (const inv of outgoing) {
        if (inv.status === "accepted" && !existingConnections.has(inv.toUserId)) {
            // The receiver accepted it, but we (sender) haven't created the local doc yet!
            const connRef = doc(db, `connections/${userId}/userConnections`, inv.toUserId);
            await setDoc(connRef, {
                connectedUserId: inv.toUserId,
                createdAt: serverTimestamp()
            }, { merge: true });
            existingConnections.add(inv.toUserId);
            createdNewSync = true;
        }
    }

    // Check incoming invites that are "accepted" but missing in local connections (safety fallback)
    for (const inv of incoming) {
        if (inv.status === "accepted" && !existingConnections.has(inv.fromUserId)) {
            const connRef = doc(db, `connections/${userId}/userConnections`, inv.fromUserId);
            await setDoc(connRef, {
                connectedUserId: inv.fromUserId,
                createdAt: serverTimestamp()
            }, { merge: true });
            existingConnections.add(inv.fromUserId);
            createdNewSync = true;
        }
    }

    return { 
        incoming: incoming.filter(i => i.status === "pending"), 
        outgoing, 
        connectionsIds: Array.from(existingConnections) 
    };
}

/**
 * Removes an existing connection between two users
 */
export async function removeConnection(currentUserId, targetUserId) {
    // Remove from current user's connections
    const currentUserConnRef = doc(db, `connections/${currentUserId}/userConnections`, targetUserId);
    await deleteDoc(currentUserConnRef);

    // Remove from target user's connections
    const targetUserConnRef = doc(db, `connections/${targetUserId}/userConnections`, currentUserId);
    await deleteDoc(targetUserConnRef);

    // Remove any accepted invites between the two users
    const invitesRef = collection(db, "invites");
    
    const q1 = query(invitesRef, where("fromUserId", "==", currentUserId), where("toUserId", "==", targetUserId));
    const snap1 = await getDocs(q1);
    for (const d of snap1.docs) {
        await deleteDoc(d.ref);
    }

    const q2 = query(invitesRef, where("fromUserId", "==", targetUserId), where("toUserId", "==", currentUserId));
    const snap2 = await getDocs(q2);
    for (const d of snap2.docs) {
        await deleteDoc(d.ref);
    }
}
