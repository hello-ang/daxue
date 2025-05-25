// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const header = document.querySelector('.header');

    if (menuToggle && navContainer) {
        // 菜单按钮点击事件
        menuToggle.addEventListener('click', function() {
            navContainer.classList.toggle('show');
            header.classList.toggle('hide');
            
            if (navContainer.classList.contains('show')) {
                navContainer.style.display = 'flex';
            }
        });

        // 点击导航链接后自动关闭菜单
        const navLinks = navContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('show');
                header.classList.remove('hide');
            });
        });

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', function(event) {
            if (!navContainer.contains(event.target) && !menuToggle.contains(event.target)) {
                navContainer.classList.remove('show');
                header.classList.remove('hide');
            }
        });
    }

    // 添加鼠标跟随效果
    document.querySelectorAll('.heritage-content').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const spotlight = card.querySelector('::after');
            if (spotlight) {
                spotlight.style.left = `${x}px`;
                spotlight.style.top = `${y}px`;
            }
        });
    });

    // 增强滚动动画
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.animationPlayState = 'running';
                
                // 为时间轴点添加延迟动画
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    setTimeout(() => {
                        dot.style.animationPlayState = 'running';
                    }, 300);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item, .heritage-card, .figure-card').forEach(item => {
        observer.observe(item);
    });

    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 