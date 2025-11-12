// Add subtle interactivity to pixel elements
document.addEventListener('DOMContentLoaded', () => {
    const pixelElements = document.querySelectorAll('.pixel-robot, .pixel-machine, .pixel-drone');
    
    // Add random delays to animations for more organic feel
    pixelElements.forEach((element, index) => {
        const randomDelay = Math.random() * 3;
        element.style.animationDelay = `${randomDelay}s`;
    });
    
    // Optional: Add a subtle parallax effect on scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                pixelElements.forEach((element, index) => {
                    const speed = 0.02 * (index + 1);
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // Console easter egg
    console.log('%c🤖 Pixel Machines Active', 'color: #00ff88; font-size: 16px; font-weight: bold;');
    console.log('%cWelcome to the machine age...', 'color: #4ecdc4; font-size: 12px;');
});

