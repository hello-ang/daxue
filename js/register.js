document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.onsubmit = async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 基本验证
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }

        try {
            // 获取现有用户数据
            const response = await fetch('data/users.txt');
            const text = await response.text();
            const users = text.split('\n')
                .slice(1) // 跳过标题行
                .filter(line => line.trim())
                .map(line => {
                    const [username, password, email, role] = line.split('|');
                    return { username, password, email, role };
                });

            // 检查用户名是否已存在
            if (users.some(u => u.username === username)) {
                alert('用户名已存在！');
                return;
            }

            // 检查邮箱是否已存在
            if (users.some(u => u.email === email)) {
                alert('邮箱已被注册！');
                return;
            }

            // 模拟注册成功
            const newUser = {
                username,
                email,
                password,
                role: 'user'
            };

            // 在实际应用中，这里应该发送到服务器
            console.log('New user registered:', newUser);

            // 注册成功后自动登录
            localStorage.setItem('currentUser', JSON.stringify({
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }));

            // 跳转到主页
            alert('注册成功！');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Registration error:', error);
            alert('注册失败，请稍后重试！');
        }
    };
}); 