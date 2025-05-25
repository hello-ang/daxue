# 云织岷韵·智能交互展廊

## 项目概述
本项目是一个基于Web技术的岷县文化宣传网站，作为学习项目开发，致力于展示和传播岷县的传统文化、旅游资源、历史传承和地方特色。网站采用现代化的前后端分离架构，提供了丰富的交互功能和用户体验。

## 网页技术特点

### 1. 现代化布局与样式
- 采用Flex布局实现灵活的页面结构
- 使用Grid网格系统进行内容排版
- 运用CSS3渐变和阴影效果增强视觉体验
- 实现响应式设计，适配不同设备屏幕
- 使用CSS动画优化交互效果

### 2. 交互设计
- 自定义轮播图组件
- 图片懒加载优化
- 平滑滚动效果
- 响应式导航菜单
- 动态加载评论系统

## 主要功能

### 1. 文化展示
- 非物质文化遗产展示
- 红色文化传承
- 传统技艺展示
- 文化特色介绍

### 2. 旅游资源
- 景点详细介绍
- 精品旅游线路推荐
- 旅游地图导航
- 景区实时信息

### 3. 特色板块
- 岷县特产展示（当归等药材）
- 传统美食介绍
- 民俗风情展示
- 历史文化故事

### 4. 互动���能
- 用户注册与登录
- 文章发布与管理
- 评论与回复系统
- 点赞功能
- 图片上传
- 用户互动社区

## 技术架构

### 前端技术
- HTML5 + CSS3
- 原生 JavaScript
- 响应式设计
- Font Awesome 图标库
- 轮播图组件
- 移动端适配

### 后端技术
- Python Flask 框架
- RESTful API 设计
- Flask-CORS 跨域支持
- Werkzeug 安全组件
- JSON 文件数据存储
- Session 用户认证

### 安全特性
- 密码加密存储
- CORS 安全配置
- Session 管理
- 文件上传安全控制
- 用户认证与授权

## 项目结构
```
project/
├── backend/               # 后端代码
│   ├── app/              # 应用核心代码
│   ├── data/             # JSON 数据存储
│   └── uploads/          # 文件上传目录
├── css/                  # 样式文件
├── js/                   # JavaScript 文件
├── images/              # 图片资源
├── src/                 # 源代码
└── uploads/             # 上传文件目录
```

## 页面说明
- `index.html`: 网站首页，展示核心内容
- `culture.html`: 文化特色展示页
- `tourism.html`: 旅游信息展示页
- `history.html`: 历史背景介绍页
- `specialties.html`: 特产美食展示页
- `folklore.html`: 民俗风情展示页
- `interaction.html`: 用户互动页面
- `about.html`: 关于岷县介绍页
- `author.html`: 作者信息页面

## 运行环境要求
- Python >= 3.7
- 现代浏览器（Chrome、Firefox、Safari、Edge等）
- 网络连接

## 安装与运行

### 1. 安装依赖
```bash
# 使用清华源
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 或使用阿里云源
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 或使用腾讯云源
pip install -r requirements.txt -i https://mirrors.cloud.tencent.com/pypi/simple
```

### 2. 运行项目
```bash
cd backend
python app.py
```
服务器将在 http://localhost:8000 启动

## 项目说明
本项目是作为Web开发课程的学习作业完成，旨在通过实践来掌握：
1. 前后端分离架构的设计与实现
2. 响应式网页设计
3. RESTful API的开发
4. 用户认证与授权
5. 文件上传与管理
6. 数据存储与处理

## 项目特色
1. 完整的文化展示体系
2. 丰富的互动功能
3. 响应式设计，支持多端访问
4. 安全可靠的用户认证
5. 高性能的前后端分离架构

## 学习收获
通过本项目的开发，加深了对以下技术的理解和应用：
- Web前端开发（HTML5/CSS3/JavaScript）
- Python Flask后端开发
- 响应式设计原理
- RESTful API设计
- 用户认证与安全
- 项目架构设计

## 版权信息
© 2023 岷县文化宣传网站 - Web开发课程作业

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate

# 然后安装依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
# university
