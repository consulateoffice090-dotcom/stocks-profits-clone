import './style.css'
import './src/auth.js'
import Alpine from 'alpinejs'


window.Alpine = Alpine

document.addEventListener('alpine:init', () => {
    Alpine.store('navigation', {
        open: false,
        toggle() {
            this.open = !this.open;
        },
        close() {
            this.open = false;
        }
    });

    Alpine.store('darkMode', {
        on: true,
        toggle() {
            this.on = !this.on;
            if (this.on) {
                document.documentElement.classList.add('dark');
                document.body.classList.add('bg-gray-900');
                document.body.classList.remove('bg-gray-100');
            } else {
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('bg-gray-900');
                document.body.classList.add('bg-gray-100');
            }
            localStorage.setItem('darkMode', this.on ? 'dark' : 'light');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('darkMode');
    if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-gray-900');
        document.body.classList.add('bg-gray-100');
        if (window.Alpine) {
            Alpine.store('darkMode').on = false;
        }
    }
});

Alpine.start()
