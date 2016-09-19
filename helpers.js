var quaternion_to_euler = function(q){   // TODO: move to ayceVR
    var sqw = q.w*q.w;
    var sqx = q.x*q.x;
    var sqy = q.y*q.y;
    var sqz = q.z*q.z;
    var unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
    var test = q.x*q.y + q.z*q.w;
    if (test > 0.499*unit) { // singularity at north pole
        return [
            2 * Math.atan2(q.x,q.w),
            Math.PI/2,
            0
        ]
    }
    if (test < -0.499*unit) { // singularity at south pole
        return [
            -2 * Math.atan2(q.x,q.w)
            -Math.PI/2,
            0
        ]
    }
    return[
        Math.atan2(2*q.y*q.w-2*q.x*q.z , sqx - sqy - sqz + sqw),
        Math.asin(2*test/unit),
        Math.atan2(2*q.x*q.w-2*q.y*q.z , -sqx + sqy - sqz + sqw)
    ]
};
var addClass = function(element, className){
    element.className += " "+className;
};

var removeClass = function(element, className2){
    element.className = element.className.replace(new RegExp(className2, 'g'), "");
};

var showNotification = function(text, icon){
    var oldNotification = document.getElementById("notification");  // remove and re-add element to re-run CSS animation
    var notification = oldNotification.cloneNode(true);
    oldNotification.parentNode.replaceChild(notification, oldNotification);

    var notificationText = document.getElementById("notification_text");
    var notificationIcon = document.getElementById("notification_icon");
    notification.style.display = "block";
    notificationText.innerHTML = text;
    notificationIcon.className = "fa " + icon;
};