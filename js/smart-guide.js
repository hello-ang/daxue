// 智慧导览页面JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载动画
    setTimeout(function() {
        document.querySelector('.content').classList.add('loaded');
    }, 100);

    // 滚动动画
    const sections = document.querySelectorAll('.guide-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 初始化高德地图
    initMap();

    // 初始化路线切换
    initRouteTabs();

    // 初始化AR演示按钮
    initARDemo();

    // 初始化评价表单
    initFeedbackForm();
});

// 初始化高德地图
function initMap() {
    // 检查地图容器是否存在
    const mapContainer = document.getElementById('map-view');
    if (!mapContainer) return;

    // 创建高德地图实例
    try {
        // 创建地图实例
        const map = new AMap.Map('map-view', {
            // 设置中心点为岷县中心位置
            center: [104.0359, 34.4344],
            // 设置缩放级别
            zoom: 13,
            // 启用滚轮缩放
            scrollWheel: true
        });
        
        // 添加缩放控件
        map.addControl(new AMap.Scale());
        // 添加比例尺控件
        map.addControl(new AMap.ToolBar());

        // 添加热门景点标记
        addMapMarkers(map);

        // 绑定景点列表点击事件
        bindSpotListEvents(map);

        // 绑定搜索按钮事件
        bindSearchEvent(map);

        // 初始化路线地图
        initRouteMap('route1-map', map);
        initRouteMap('route2-map', map);
        initRouteMap('route3-map', map);
    } catch (error) {
        console.error('高德地图初始化失败:', error);
        mapContainer.innerHTML = '<div style="padding: 20px; text-align: center;">地图加载失败，请检查网络连接或刷新页面重试。</div>';
    }
}

// 添加地图标记
function addMapMarkers(map) {
    const spots = [
        { name: '狼渡滩湿地草原', lat: 34.4344, lng: 104.0359, type: '自然风光' },
        { name: '当归城景区', lat: 34.4388, lng: 104.0212, type: '文化景点' },
        { name: '二郎山风景区', lat: 34.4301, lng: 104.0421, type: '自然风光' },
        { name: '长虹桥', lat: 34.4356, lng: 104.0298, type: '历史建筑' },
        { name: '岷州古城', lat: 34.4367, lng: 104.0327, type: '历史文化' }
    ];

    spots.forEach(spot => {
        // 创建标记
        const marker = new AMap.Marker({
            position: [spot.lng, spot.lat],
            title: spot.name
        });
        // 将标记添加到地图
        marker.setMap(map);

        // 创建信息窗口内容
        const infoWindowContent = `
            <div style="padding: 10px;">
                <h4 style="margin-bottom: 5px; color: #983636;">${spot.name}</h4>
                <p style="margin-bottom: 5px;">类型: ${spot.type}</p>
                <button onclick="showSpotDetails('${spot.name}')" 
                        style="background: #983636; color: white; border: none; 
                               padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                    查看详情
                </button>
            </div>`;

        // 创建信息窗口
        const infoWindow = new AMap.InfoWindow({
            content: infoWindowContent,
            offset: new AMap.Pixel(0, -30)
        });

        // 点击标记显示信息窗口
        marker.on('click', function() {
            infoWindow.open(map, marker.getPosition());
        });
    });
    });
}

// 绑定景点列表点击事件
function bindSpotListEvents(map) {
    const spotItems = document.querySelectorAll('#popular-spots li');
    spotItems.forEach(item => {
        item.addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            
            // 设置地图中心点和缩放级别
            map.setCenter([lng, lat]);
            map.setZoom(15);
            
            // 获取所有标记并模拟点击
            map.getAllOverlays('marker').forEach(marker => {
                const position = marker.getPosition();
                if (position && 
                    Math.abs(position.lat - lat) < 0.0001 && 
                    Math.abs(position.lng - lng) < 0.0001) {
                    // 触发标记的点击事件
                    marker.emit('click');
                }
            });
        });
    });
}

// 绑定搜索按钮事件
function bindSearchEvent(map) {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('spot-search');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const keyword = searchInput.value.trim();
            if (keyword) {
                // 使用高德地图搜索服务
                AMap.service('AMap.PlaceSearch', function() {
                    const placeSearch = new AMap.PlaceSearch({
                        city: '岷县',  // 限制在岷县范围内搜索
                        map: map       // 展示在当前地图上
                    });
                    placeSearch.search(keyword);
                });
            }
        });

        // 回车键触发搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

// 初始化路线地图
function initRouteMap(containerId, mainMap) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // 创建路线地图实例
        const routeMap = new AMap.Map(containerId, {
            // 设置中心点为岷县中心位置
            center: [104.0359, 34.4344],
            // 设置缩放级别
            zoom: 12,
            // 启用滚轮缩放
            scrollWheel: true
        });
        
        // 添加缩放控件
        routeMap.addControl(new AMap.Scale());
        // 添加工具条控件
        routeMap.addControl(new AMap.ToolBar());

        // 根据路线ID添加不同的路线
        if (containerId === 'route1-map') {
            addRoute1(routeMap);
        } else if (containerId === 'route2-map') {
            addRoute2(routeMap);
        } else if (containerId === 'route3-map') {
            addRoute3(routeMap);
        }
    } catch (error) {
        console.error(`路线地图初始化失败 (${containerId}):`, error);
        container.innerHTML = '<div style="padding: 20px; text-align: center;">路线地图加载失败，请检查网络连接或刷新页面重试。</div>';
    }
}

// 添加经典一日游路线
function addRoute1(map) {
    // 路线点
    const points = [
        { name: '岷州古城', lng: 104.0327, lat: 34.4367 },
        { name: '长虹桥', lng: 104.0298, lat: 34.4356 },
        { name: '当归城景区', lng: 104.0212, lat: 34.4388 },
        { name: '二郎山风景区', lng: 104.0421, lat: 34.4301 }
    ];

    // 添加标记和连线
    addRouteMarkersAndLine(map, points);
}

// 添加文化探索二日游路线
function addRoute2(map) {
    // 第一天路线点
    const day1Points = [
        { name: '岷州古城', lng: 104.0327, lat: 34.4367 },
        { name: '当归博物馆', lng: 104.0245, lat: 34.4375 },
        { name: '当归种植基地', lng: 104.0180, lat: 34.4390 }
    ];

    // 第二天路线点
    const day2Points = [
        { name: '狼渡滩湿地草原', lng: 104.0359, lat: 34.4344 },
        { name: '二郎山风景区', lng: 104.0421, lat: 34.4301 }
    ];

    // 添加第一天路线（红色）
    addRouteMarkersAndLine(map, day1Points, '#e74c3c');
    
    // 添加第二天路线（蓝色）
    addRouteMarkersAndLine(map, day2Points, '#3498db');

    // 添加图例
    addRouteLegend(map, [
        { color: '#e74c3c', text: '第一天' },
        { color: '#3498db', text: '第二天' }
    ]);
}

// 添加深度体验三日游路线
function addRoute3(map) {
    // 三日游路线点（简化版）
    const points = [
        { name: '岷州古城', lng: 104.0327, lat: 34.4367 },
        { name: '长虹桥', lng: 104.0298, lat: 34.4356 },
        { name: '当归城景区', lng: 104.0212, lat: 34.4388 },
        { name: '当归博物馆', lng: 104.0245, lat: 34.4375 },
        { name: '狼渡滩湿地草原', lng: 104.0359, lat: 34.4344 },
        { name: '二郎山风景区', lng: 104.0421, lat: 34.4301 },
        { name: '民俗村', lng: 104.0280, lat: 34.4320 }
    ];

    // 添加标记和连线
    addRouteMarkersAndLine(map, points, '#27ae60');
}

// 添加路线标记和连线
function addRouteMarkersAndLine(map, points, lineColor = '#983636') {
    // 创建标记和收集坐标点
    const pathCoordinates = [];
    
    points.forEach((point, index) => {
        // 创建坐标点
        const position = [point.lng, point.lat];
        pathCoordinates.push(position);
        
        // 创建标记
        const marker = new AMap.Marker({
            position: position,
            title: point.name
        });
        
        // 添加标签
        const content = `<div style="color: #fff; background-color: ${lineColor}; border-radius: 3px; padding: 5px;">${index + 1}. ${point.name}</div>`;
        const label = new AMap.Text({
            text: content,
            anchor: 'bottom-center',
            offset: new AMap.Pixel(20, -10),
            style: {
                'background-color': 'transparent',
                'border': 'none'
            }
        });
        
        // 将标记和标签添加到地图
        marker.setMap(map);
        label.setMap(map);
        label.setPosition(position);
    });
    
    // 创建折线
    const polyline = new AMap.Polyline({
        path: pathCoordinates,
        strokeColor: lineColor,
        strokeWeight: 5,
        strokeOpacity: 0.7
    });
    
    // 将折线添加到地图
    polyline.setMap(map);

    // 调整视图以包含所有点
    map.setFitView();
}

// 添加路线图例
function addRouteLegend(map, legends) {
    // 创建图例控件
    const legendControl = document.createElement('div');
    legendControl.className = 'route-legend';
    legendControl.style.cssText = 'position: absolute; bottom: 20px; right: 20px; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 100;';
    
    // 添加图例项
    legends.forEach(legend => {
        const legendItem = document.createElement('div');
        legendItem.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px;';
        
        const colorBox = document.createElement('span');
        colorBox.style.cssText = `display: inline-block; width: 15px; height: 15px; background-color: ${legend.color}; margin-right: 5px;`;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = legend.text;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(textSpan);
        legendControl.appendChild(legendItem);
    });
    
    // 将图例添加到地图
    map.getContainer().appendChild(legendControl);
}

// 初始化路线切换
function initRouteTabs() {
    const routeTabs = document.querySelectorAll('.route-tab');
    const routeDetails = document.querySelectorAll('.route-detail');

    routeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活动状态
            routeTabs.forEach(t => t.classList.remove('active'));
            routeDetails.forEach(d => d.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const routeId = this.getAttribute('data-route');
            document.getElementById(routeId).classList.add('active');
        });
    });
}

// 初始化AR演示
function initARDemo() {
    const startARBtn = document.getElementById('start-ar');
    if (startARBtn) {
        startARBtn.addEventListener('click', function() {
            // 创建模态框
            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;';
            
            // 创建AR演示内容
            const arContent = document.createElement('div');
            arContent.style.cssText = 'background: white; width: 90%; max-width: 800px; height: 80%; border-radius: 10px; position: relative; overflow: hidden;';
            
            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; background: #983636; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 10;';
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // 创建AR演示内容
            const arDemo = document.createElement('div');
            arDemo.style.cssText = 'padding: 20px; height: 100%; overflow-y: auto;';
            arDemo.innerHTML = `
                <h2 style="color: #983636; margin-bottom: 20px; text-align: center;">AR实景导览演示</h2>
                <p style="margin-bottom: 20px;">这是AR实景导览的演示界面。在实际应用中，您可以通过手机摄像头扫描景点标识，获取丰富的AR内容。</p>
                <div style="text-align: center; margin: 30px 0;">
                    <img src="images/全景.webp" alt="AR导览演示" style="max-width: 100%; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                </div>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #983636; margin-bottom: 10px;">当归城景区 - AR内容示例</h3>
                    <p>通过AR技术，您可以看到：</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>当归种植的历史变迁</li>
                        <li>当归药材的3D模型和生长过程</li>
                        <li>传统采收和加工工艺的演示</li>
                        <li>当归药用价值和功效的详细介绍</li>
                    </ul>
                </div>
                <p style="text-align: center; color: #666;">请在实际游览时下载我们的AR应用，获取完整体验。</p>
            `;
            
            arContent.appendChild(closeBtn);
            arContent.appendChild(arDemo);
            modal.appendChild(arContent);
            document.body.appendChild(modal);
        });
    }
}

// 初始化评价表单
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userName = document.getElementById('user-name').value;
            const userRating = document.getElementById('user-rating').value;
            const userComment = document.getElementById('user-comment').value;
            
            // 这里可以添加将评价提交到服务器的代码
            // 模拟提交成功
            alert(`感谢您的评价，${userName}！`);
            
            // 添加评价到页面
            addFeedbackToPage(userName, userRating, userComment);
            
            // 重置表单
            feedbackForm.reset();
        });
    }
}

// 添加评价到页面
function addFeedbackToPage(name, rating, comment) {
    const feedbackContainer = document.querySelector('.feedback-container');
    if (feedbackContainer) {
        // 创建新的评价元素
        const newFeedback = document.createElement('div');
        newFeedback.className = 'feedback-item';
        newFeedback.innerHTML = `
            <div class="user-avatar">
                <img src="images/无标题.jpg" alt="用户头像">
            </div>
            <div class="feedback-content">
                <div class="user-name">${name}</div>
                <div class="feedback-rating">${'⭐'.repeat(rating)}</div>
                <p>${comment}</p>
            </div>
        `;
        
        // 添加到容器的开头
        feedbackContainer.insertBefore(newFeedback, feedbackContainer.firstChild);
        
        // 添加动画效果
        setTimeout(() => {
            newFeedback.style.transition = 'all 0.5s ease';
            newFeedback.style.backgroundColor = '#f9f9f9';
            setTimeout(() => {
                newFeedback.style.backgroundColor = 'white';
            }, 1000);
        }, 10);
    }
}

// 显示景点详情（占位函数）
function showSpotDetails(spotName) {
    alert(`您点击了查看${spotName}的详情，这里将显示更多信息。`);
}