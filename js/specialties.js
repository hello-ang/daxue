document.addEventListener('DOMContentLoaded', function() {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = function() {
        scrollRevealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85) {
                element.classList.add('active');
            }
        });
    };
    
    // 初始检查
    revealOnScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', revealOnScroll);
}); 