export function toast(message, type = 'success') {
    const isError = type === 'error';
    const bg = isError ? 'bg-red-500' : 'bg-emerald-500';
    
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none items-end max-w-sm';
        document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `transform -translate-y-10 opacity-0 transition-all duration-300 ease-out flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white font-medium ${bg}`;
    
    const text = document.createElement('span');
    text.textContent = message;
    toastEl.appendChild(text);

    container.appendChild(toastEl);

    requestAnimationFrame(() => {
        // Animate in
        requestAnimationFrame(() => {
            toastEl.classList.remove('-translate-y-10', 'opacity-0');
        });
    });

    setTimeout(() => {
        toastEl.classList.add('opacity-0', 'scale-95');
        setTimeout(() => toastEl.remove(), 300);
    }, 3000);
}
