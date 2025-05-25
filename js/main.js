
/**
 * 动画滚动函数
 * @param {Element} element - 目标元素
 * @param {Number} duration - 动画持续时间
 */
function smoothScroll(element, duration) {
    const targetPosition = element.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, startPosition + targetPosition * progress);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// ==========================================================================
// 2. 事件处理
// ==========================================================================

/**
 * 导航栏响应式处理
 */
function handleNavigation() {
    const nav = document.querySelector('.nav');
    const links = nav.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/**
 * 图片懒加载函数
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ==========================================================================
// 3. 页面初始化
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    handleNavigation();
    lazyLoadImages();
    
    // 添加滚动动画
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScroll(target, 1000);
            }
        });
    });
}); 