// 进度环动画
document.addEventListener('DOMContentLoaded', function() {
    const circles = document.querySelectorAll('.progress-ring-circle');
    circles.forEach(circle => {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        const value = parseInt(circle.parentElement.parentElement.dataset.value);
        const offset = circumference - (value / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    });
});

window.onload = function() {
    var map = new AMap.Map('map', {
        resizeEnable: true,
        zoom: 13,
        center: [104.036758, 34.438306]
    });

    // 添加标记
    var marker = new AMap.Marker({
        position: new AMap.LngLat(104.036758, 34.438306),
        title: '岷县'
    });
    marker.setMap(map);

    // 设置地图的显示范围
    map.setFitView();
} 