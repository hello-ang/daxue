document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    try {
        // 绑定按钮事件
        const loginBtn = document.querySelector('.submit-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', handleLogin);
        }
        
        checkLoginStatus();
        loadArticles();
        updateUserInfo();
    } catch (error) {
        console.error('初始化失败:', error);
    }
});

// 用户界面控制
function showRegisterForm() {
    console.log('显示注册表单');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm && registerForm) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    } else {
        console.error('找不到表单元素');
    }
}

function showLoginForm() {
    console.log('显示登录表单');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm && registerForm) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        console.error('找不到表单元素');
    }
}

// 检查登录状态
async function checkLoginStatus() {
    try {
        const data = await makeAPIRequest(`${API_BASE_URL}/check-auth`);
        
        const authSection = document.getElementById('auth');
        const publishSection = document.getElementById('publish');
        const userToolbar = document.querySelector('.user-toolbar');
        
        if (data.authenticated) {
            localStorage.setItem('user', JSON.stringify(data.user));
            authSection.style.display = 'none';
            publishSection.style.display = 'block';
            userToolbar.style.display = 'flex'; // 显示用户工具栏
            updateUserInfo(); // 更新用户名显示
        } else {
            localStorage.removeItem('user');
            authSection.style.display = 'block';
            publishSection.style.display = 'none';
            userToolbar.style.display = 'none'; // 隐藏用户工具栏
        }
    } catch (error) {
        console.error('检查登录状态失败:', error);
        localStorage.removeItem('user');
    }
}

// 处理登出
async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        localStorage.removeItem('user');
        checkLoginStatus();
        loadArticles(); // 重新加载文章列表
    } catch (error) {
        console.error('登出失败:', error);
    }
}

// 处理登录
async function handleLogin() {
    console.log('处理登录');
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // 确保正确存储用户信息
        localStorage.setItem('user', JSON.stringify(data.user));
            console.log('登录成功，用户信息:', data.user); // 添加调试日志
        alert('登录成功！');
        checkLoginStatus();
            loadArticles(); // 重新加载文章列表
        } else {
            throw new Error(data.error || '录失败');
        }
    } catch (error) {
        alert(error.message);
    }
}

// 处理注册
async function handleRegister() {
    console.log('处理注册');
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    try {
        await register(username, password);
        alert('注册成功！请登录');
        showLoginForm();
    } catch (error) {
        alert(error.message);
    }
}

// 处理文章提交
async function handleArticleSubmit() {
    const title = document.getElementById('articleTitle').value;
    const content = document.getElementById('articleContent').value;
    const imageInput = document.getElementById('imageInput');
    
    if (!title || !content) {
        alert('请填写完整的文章信息');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        
        // 获取预览图片的base64数据
        const imagePreview = document.getElementById('imagePreview');
        const images = Array.from(imagePreview.getElementsByTagName('img'))
            .map(img => img.src);
        
        // 添加片数据到formData
        images.forEach((imgData, index) => {
            formData.append(`image${index}`, imgData);
        });

        const response = await fetch(`${API_BASE_URL}/articles`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            alert('文章发布成功！');
            document.getElementById('articleTitle').value = '';
            document.getElementById('articleContent').value = '';
            document.getElementById('imagePreview').innerHTML = '';
            imageInput.value = '';
            loadArticles();
        } else {
            const data = await response.json();
            throw new Error(data.error || '发布失败');
        }
    } catch (error) {
        alert('发布失败：' + error.message);
    }
}

// 添加加载状态指示器
function showLoading() {
    const container = document.getElementById('articlesContainer');
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>加载中...</p>
        </div>
    `;
}

// 修改加载文章函数
async function loadArticles() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const articles = await response.json();
        if (articles && Array.isArray(articles)) {
            renderArticles(articles);
        } else {
            console.error('获取到的文章数据格式不正确');
            document.getElementById('articlesContainer').innerHTML = '<p class="no-data">暂无文章</p>';
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        document.getElementById('articlesContainer').innerHTML = 
            '<p class="error-message">加载失败，请点击<a href="javascript:void(0)" onclick="loadArticles()">重试</a></p>';
    }
}

// 渲染文章列表
function renderArticles(articles) {
    const container = document.getElementById('articlesContainer');
    if (!container) {
        console.error('找不到文章容器元素');
        return;
    }

    try {
        const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        
        container.innerHTML = articles.map(article => `
            <div class="article-card" data-article-id="${article.id}">
                <div class="article-header">
                    <div class="article-title">
                        <h3>${article.title}</h3>
                        <div class="article-controls">
                            ${currentUser && currentUser.id === article.author_id ? 
                                `<button onclick="deleteArticle('${article.id}')" class="article-delete-btn">
                                    ×
                                </button>` : ''
                            }
                        </div>
                    </div>
                    <div class="article-meta">
                        <span><i class="fas fa-user"></i> ${article.author}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(article.created_at).toLocaleString()}</span>
                    </div>
                </div>
                <div class="article-content">
                    <p>${article.content}</p>
                    ${article.images && article.images.length > 0 ? `
                        <div class="article-images">
                            ${article.images.map(img => `
                                <div class="article-image">
                                    <img src="${img}" alt="文章图片" onclick="openImageModal(this)">
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="article-actions">
                    <button onclick="handleLike('${article.id}')" class="action-btn like-btn ${article.liked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i>
                        <span>点赞 ${article.like_count || 0}</span>
                    </button>
                    <button onclick="showCommentForm('${article.id}')" class="action-btn comment-btn">
                        <i class="fas fa-comment"></i>
                        <span>评论 ${article.comments ? article.comments.length : 0}</span>
                    </button>
                </div>
                <div class="comment-form" id="commentForm-${article.id}" style="display: none;">
                    <textarea id="commentContent-${article.id}" placeholder="写下你的评论..."></textarea>
                    <button onclick="handleComment('${article.id}')" class="submit-btn">发表评论</button>
                </div>
                <div class="comments-container" id="comments-${article.id}">
                    ${renderComments(article.comments)}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('渲染文章失败:', error);
        container.innerHTML = '<p class="error-message">渲染失败，请刷新页面重试</p>';
    }
}

// 修改渲染评论函数
function renderComments(comments) {
    if (!comments || comments.length === 0) {
        return '<div class="no-comments">暂无评论</div>';
    }
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const topLevelComments = comments.filter(comment => !comment.parent_id);
    
    return topLevelComments.map(comment => {
        const replies = comments.filter(reply => reply.parent_id === comment.id);
        
        return `
            <div class="comment">
                <div class="comment-meta">
                    <div class="comment-info">
                        <span class="comment-author">
                            <i class="fas fa-user"></i> ${comment.author}
                        </span>
                        <span class="comment-date">
                            <i class="fas fa-clock"></i> ${new Date(comment.created_at).toLocaleString()}
                        </span>
                    </div>
                    ${currentUser && currentUser.id === comment.user_id ? `
                        <button onclick="deleteComment('${comment.id}')" class="comment-delete-btn">
                            ×
                        </button>
                    ` : ''}
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-actions">
                    <button onclick="showReplyForm('${comment.id}')" class="reply-button">
                        <i class="fas fa-reply"></i> 回复
                    </button>
                </div>
                <div class="reply-form" id="replyForm-${comment.id}" style="display: none;">
                    <textarea id="replyContent-${comment.id}" placeholder="写下你的回复..."></textarea>
                    <button onclick="handleReply('${comment.id}')" class="submit-btn">发表回复</button>
                </div>
                ${replies.length > 0 ? `
                    <div class="replies">
                        ${replies.map(reply => `
                            <div class="reply">
                                <div class="reply-meta">
                                    <div class="reply-info">
                                        <span class="reply-author">
                                            <i class="fas fa-user"></i> ${reply.author}
                                        </span>
                                        <span class="reply-date">
                                            <i class="fas fa-clock"></i> ${new Date(reply.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    ${currentUser && currentUser.id === reply.user_id ? `
                                        <button onclick="deleteComment('${reply.id}')" class="comment-delete-btn">
                                            ×
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="reply-content">${reply.content}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// 显示评论表单
function showCommentForm(articleId) {
    const form = document.getElementById(`commentForm-${articleId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// 处理评论提交
async function handleComment(articleId) {
    const content = document.getElementById(`commentContent-${articleId}`).value;
    const commentForm = document.getElementById(`commentForm-${articleId}`);
    const submitBtn = commentForm.querySelector('.submit-btn');
    
    if (!content) {
        alert('请输入评论内容');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '发送中...';

    try {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ content })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        // 只更新评论区域
        const commentsContainer = document.getElementById(`comments-${articleId}`);
        commentsContainer.innerHTML = renderComments(data.comments);
        
        document.getElementById(`commentContent-${articleId}`).value = '';
        commentForm.style.display = 'none';
    } catch (error) {
        alert('评论失败：' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '发表评论';
    }
}

// 处理点赞
async function handleLike(articleId) {
    try {
        // 检查用户是否登录
        if (!localStorage.getItem('user')) {
            alert('请先登录');
            return;
        }

        const likeButton = document.querySelector(`button[onclick="handleLike('${articleId}')"]`);
        
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/like`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            // 更新点赞按钮状态和数量
            const likeCount = data.like_count;
            likeButton.innerHTML = `<i class="fas fa-heart"></i> 点赞 (${likeCount})`;
            likeButton.classList.add('liked');
        } else {
            if (data.error === '已经点赞过了') {
                alert('您已经点赞过了');
            } else {
                throw new Error(data.error || '点赞失败');
            }
        }
    } catch (error) {
        console.error('点赞失败:', error);
        alert('点赞失败：' + error.message);
    }
}

// 渲染话题列表
function renderTopics(topics) {
    const topicsContainer = document.querySelector('.topics-container');
    topicsContainer.innerHTML = topics.map(topic => `
        <div class="topic-card">
            <div class="topic-header">
                <h3>${topic.title}</h3>
                <span class="topic-meta">
                    <i class="fas fa-user"></i> 发起人：${topic.author}
                    <i class="fas fa-clock"></i> ${new Date(topic.date).toLocaleDateString()}
                </span>
            </div>
            <p class="topic-content">${topic.content}</p>
            <div class="topic-stats">
                <span><i class="fas fa-eye"></i> ${topic.views}</span>
                <span><i class="fas fa-comment"></i> ${topic.comments}</span>
                <span><i class="fas fa-heart"></i> ${topic.likes}</span>
            </div>
        </div>
    `).join('');
}

// 获取话题列表
async function fetchTopics() {
    try {
        const response = await fetch('http://localhost:8000/api/topics');
        const topics = await response.json();
        renderTopics(topics);
    } catch (error) {
        console.error('获取话题失败:', error);
    }
}

// 提交留言
async function submitMessage(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        content: document.getElementById('message').value,
        date: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:8000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('留言提交成功！');
            document.getElementById('messageForm').reset();
            fetchMessages();
        }
    } catch (error) {
        console.error('提交留言失败:', error);
    }
}

// 定义API基础URL - 动态获取当前访问的主机地址
const API_BASE_URL = window.location.protocol + '//' + window.location.host + '/api';

// API请求统一处理函数
async function makeAPIRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}

// 用户认证相关函数
async function register(username, password) {
    return await makeAPIRequest(`${API_BASE_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

async function login(username, password) {
    return await makeAPIRequest(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

// 文章相关函数
async function createArticle(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || '发布失败');
        }
        
        return response;
    } catch (error) {
        console.error('发布文章失败:', error);
        throw error;
    }
}

async function getArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        const articles = await response.json();
        return articles;
    } catch (error) {
        console.error('获文章列表失败:', error);
        throw error;
    }
}

async function getArticleDetail(articleId) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}`);
        const article = await response.json();
        return article;
    } catch (error) {
        console.error('获取文章详情失败:', error);
        throw error;
    }
}

// 评论相关函数
async function addComment(articleId, content) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ content })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error('发表评论失败:', error);
        throw error;
    }
}

// 点赞相关函数
async function likeArticle(articleId) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/like`, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error('点赞失败:', error);
        throw error;
    }
}

// 在页面加载时测试API连接
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        console.log('API服务器状态:', data);
    } catch (error) {
        console.error('无法连接到API服务器:', error);
    }
});

// 图片预览和删除功能
function handleImageUpload(event) {
    const files = event.target.files;
    const imagePreview = document.getElementById('imagePreview');

    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const container = document.createElement('div');
                container.className = 'preview-image-container';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-image';
                removeBtn.type = 'button';
                removeBtn.innerHTML = '✕';
                removeBtn.style.zIndex = '10';

                removeBtn.addEventListener('click', function() {
                    container.remove();
                });

                container.appendChild(img);
                container.appendChild(removeBtn);
                imagePreview.appendChild(container);
            };
            reader.readAsDataURL(file);
        }
    }
}

// 示用户名
function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('currentUsername').textContent = user.username;
    }
}

// 显示图片预览
function showImagePreview(imageUrl) {
    const preview = document.getElementById('imagePreview');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = '图片预览';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    preview.innerHTML = '';
    preview.appendChild(img);
}

// 添加全屏显示图片的能
function showFullImage(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${src}" alt="全屏图片">
        </div>
    `;
    document.body.appendChild(modal);
}

// 显示回复表单
function showReplyForm(commentId) {
    const form = document.getElementById(`replyForm-${commentId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// 处理回复提
async function handleReply(commentId) {
    const content = document.getElementById(`replyContent-${commentId}`).value;
    
    if (!content) {
        alert('请输入回复内容');
        return;
    }

    try {
        await addReply(commentId, content);
        alert('回复成功！');
        document.getElementById(`replyContent-${commentId}`).value = '';
        document.getElementById(`replyForm-${commentId}`).style.display = 'none';
        loadArticles();
    } catch (error) {
        alert('回复失败：' + error.message);
    }
}

// 添加回复API函数
async function addReply(commentId, content) {
    try {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ content })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    } catch (error) {
        console.error('发表回复失败:', error);
        throw error;
    }
}

// 优化删除文章功能
async function deleteArticle(articleId) {
    if (!confirm('确定要删除这篇文章吗？')) {
        return;
    }
    
    const articleElement = document.querySelector(`[data-article-id="${articleId}"]`);
    if (articleElement) {
        articleElement.classList.add('deleting');
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            if (articleElement) {
                articleElement.remove();
            }
            // 不再重新加载整个列表
            // loadArticles();
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    } catch (error) {
        alert('删除失败：' + error.message);
        if (articleElement) {
            articleElement.classList.remove('deleting');
        }
    }
}

// 添加删除评论功能
async function deleteComment(commentId) {
    if (!confirm('确定要删除这条评论吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            alert('评论删除成功！');
            loadArticles();
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    } catch (error) {
        alert('删除失败：' + error.message);
    }
}

// 添加导航菜单切换功能
function toggleMenu() {
    const navContainer = document.querySelector('.nav-container');
    navContainer.classList.toggle('show');
}

// 点击导航链接后自动关闭菜单
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        const navContainer = document.querySelector('.nav-container');
        if (navContainer.classList.contains('show')) {
            navContainer.classList.remove('show');
        }
    });
});

// 点击页面其他区域关闭菜单
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) {
        const navContainer = document.querySelector('.nav-container');
        if (navContainer.classList.contains('show')) {
            navContainer.classList.remove('show');
        }
    }
});

// 图片模态框功能
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

function openImageModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.classList.add('active');
    modalImg.src = img.src;
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 恢复背景滚动
}

// 点击关闭按钮关闭模态框
document.querySelector('.close-modal').onclick = function() {
    closeImageModal();
}

// 点击模态框背景关闭
document.getElementById('imageModal').onclick = function(e) {
    if (e.target === this) {
        closeImageModal();
    }
}

// ESC键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
}); 