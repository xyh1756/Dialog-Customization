function checkbox() {
    let top = document.getElementsByClassName("template-manage-table-title-opt top is-disabled")[0];
    let bottom = document.getElementsByClassName("template-manage-table-title-opt bottom is-disabled")[0];
    let del = document.getElementsByClassName("template-manage-table-title-opt del is-disabled")[0];
    if (top !== undefined) {
        let patterns = document.getElementsByClassName("table-row");
        for (let i = 0; i < patterns.length; i++) {
            if (patterns[i].getElementsByClassName("ai-checkbox-input")[0].checked) {
                top.setAttribute("class", "template-manage-table-title-opt top");
                bottom.setAttribute("class", "template-manage-table-title-opt bottom");
                del.setAttribute("class", "template-manage-table-title-opt del");
                break;
            }
        }
    } else {
        let top = document.getElementsByClassName("template-manage-table-title-opt top")[0];
        let bottom = document.getElementsByClassName("template-manage-table-title-opt bottom")[0];
        let del = document.getElementsByClassName("template-manage-table-title-opt del")[0];
        let patterns = document.getElementsByClassName("table-row");
        for (let i = 0; i < patterns.length; i++) {
            if (patterns[i].getElementsByClassName("ai-checkbox-input")[0].checked) {
                break;
            }
            if (i == patterns.length -1) {
                top.setAttribute("class", "template-manage-table-title-opt top is-disabled");
                bottom.setAttribute("class", "template-manage-table-title-opt bottom is-disabled");
                del.setAttribute("class", "template-manage-table-title-opt del is-disabled");
            }
        }
    }
}

function selectAll() {
    let patterns = document.getElementsByClassName("table-row");
    let select_all = document.getElementById("select_all");
    if (select_all.checked) {
        for (let i = 0; i < patterns.length; i++) {
            patterns[i].getElementsByClassName("ai-checkbox-input")[0].checked = true;
        }
    } else {
        for (let i = 0; i < patterns.length; i++) {
            patterns[i].getElementsByClassName("ai-checkbox-input")[0].checked = false;
        }
    }
    checkbox();
}

function addPattern() {
    let show = document.getElementsByClassName("template-manage-form-wrap")[0];
    if (show.style.display == "none") {
        show.style.display = "block";
        let hidden = document.getElementsByClassName("template-manage-form-wrap is-hidden")[0];
        hidden.style.display = "none";
    } else {
        show.style.display = "none";
        let hidden = document.getElementsByClassName("template-manage-form-wrap is-hidden")[0];
        hidden.style.display = "block";
    }
}

$(document).ready(function () {
    $("#cnt-input-edit").bind('DOMNodeInserted DOMNodeRemoved', function(e) {
        if (e.type == 'DOMNodeInserted') {
            let confirm = document.getElementsByClassName("ant-btn add-form-confirm-btn")[0];
            confirm.disabled = false;
        } else {
            let confirm = document.getElementsByClassName("ant-btn add-form-confirm-btn")[0];
            confirm.disabled = true;
        }
    });
});

function checkConfirm() {
    let name = document.getElementsByClassName("ant-input keyword-name-input")[0];
    let value = document.getElementsByClassName("modal-text-input keywords-dict")[0];
    let confirm = document.getElementById("confirm");
    if (name.value != "" && value.value != "") {
        confirm.disabled = false;
    } else {
        confirm.disabled = true;
    }
}

function checkConfirm2() {
    let name = document.getElementsByClassName("ant-input keyword-name-input")[1];
    let value = document.getElementsByClassName("modal-text-input keywords-dict")[1];
    let confirm = document.getElementById("confirm2");
    if (name.value != "" && value.value != "") {
        confirm.disabled = false;
    } else {
        confirm.disabled = true;
    }
}

function checkConfirmKey() {
    let name = document.getElementsByClassName("ant-input keyword-name-input")[0];
    let confirm = document.getElementById("confirm");
    if (name.value != "") {
        confirm.disabled = false;
    } else {
        confirm.disabled = true;
    }
}

function confirm() {
    let this_type = document.getElementsByClassName("cnt-input-select")[0].value;
    let content = document.getElementsByClassName("cnt-input-edit")[0].innerHTML;
    $.ajax({
        type: 'POST',
        url: '/add_pattern',
        data: {
            "this_type": this_type,
            "content": content
        },
        success: setTimeout(function () {
            location.reload();
        }, 50),
        dataType: 'json'
    });
}

function addFeature() {
    let dict_key = document.getElementsByClassName("ant-input keyword-name-input")[0].value;
    let dict_value = document.getElementsByClassName("modal-text-input keywords-dict")[0].value;
    $.ajax({
        type: 'POST',
        url: '/add_feature',
        data: {
            "dict_key": dict_key,
            "dict_value": dict_value
        },
        success: setTimeout(function () {
            location.reload();
        }, 50),
        dataType: 'json'
    });
}

function addGeneral() {
    let general_key = document.getElementsByClassName("ant-input keyword-name-input")[0].value;
    let general_value = document.getElementsByClassName("modal-text-input keywords-dict")[0].value;
    $.ajax({
        type: 'POST',
        url: '/add_general',
        data: {
            "general_key": general_key,
            "general_value": general_value
        },
        success: setTimeout(function () {
            location.reload();
        }, 50),
        dataType: 'json'
    });
}

function editFeature() {
    let feature_key = document.getElementsByClassName("edit-feature-key")[0].innerHTML;
    let dict_key = document.getElementsByClassName("ant-input keyword-name-input")[1].value;
    let dict_value = document.getElementsByClassName("modal-text-input keywords-dict")[1].value;
    $.ajax({
        type: 'POST',
        url: '/del_feature',
        data: {
            "feature_key": feature_key
        },
        success: setTimeout(function () {
            $.ajax({
                type: 'POST',
                url: '/add_feature',
                data: {
                    "dict_key": dict_key,
                    "dict_value": dict_value
                },
                success: setTimeout(function () {
                    location.reload();
                }, 30),
                dataType: 'json'
            });
        }, 30),
        dataType: 'json'
    });
}

function editGeneral() {
    let feature_key = document.getElementsByClassName("edit-feature-key")[0].innerHTML;
    let general_key = document.getElementsByClassName("ant-input keyword-name-input")[1].value;
    let general_value = document.getElementsByClassName("modal-text-input keywords-dict")[1].value;
    $.ajax({
        type: 'POST',
        url: '/del_general',
        data: {
            "general_key": feature_key
        },
        success: setTimeout(function () {
            $.ajax({
                type: 'POST',
                url: '/add_general',
                data: {
                    "general_key": general_key,
                    "general_value": general_value
                },
                success: setTimeout(function () {
                    location.reload();
                }, 30),
                dataType: 'json'
            });
        }, 30),
        dataType: 'json'
    });

}

function getFeatureKey() {
    let feature_key = document.getElementsByClassName("edit-feature-key")[0].innerHTML;
    let feature_values = document.getElementsByClassName("edit-feature-value")[0].innerHTML;
    let feature_value = feature_values.split('、').join('\n');
    let dict_key = document.getElementsByClassName("ant-input keyword-name-input")[1];
    let dict_value = document.getElementsByClassName("modal-text-input keywords-dict")[1];
    dict_key.value = feature_key;
    dict_key.disabled = "disabled";
    dict_value.value = feature_value;
}

function addSlot() {
    let slot_key = document.getElementsByClassName("ant-input keyword-name-input")[0].value;
    let slot_disc = document.getElementsByClassName("modal-text-input keywords-dict")[0].value;
    if (!slot_disc) {
        slot_disc = "暂无描述";
    }
    $.ajax({
        type: 'POST',
        url: '/add_slot',
        data: {
            "slot_key": slot_key,
            "slot_disc": slot_disc
        },
        success: setTimeout(function () {
            location.reload();
        }, 30),
        dataType: 'json'
    });
}

function delSlot(obj) {
    let slot_id = obj.id;
    $.ajax({
        type: 'POST',
        url: '/del_slot',
        data: {
            "slot_id": slot_id
        },
        success: setTimeout(function () {
            location.reload();
        }, 30),
        dataType: 'json'
    });
}

function delFeature(obj) {
    let feature_key = obj.id;
    $.ajax({
        type: 'POST',
        url: '/del_feature',
        data: {
            "feature_key": feature_key
        },
        success: setTimeout(function () {
            location.reload();
        }, 50),
        dataType: 'json'
    });
}

function delGeneral(obj) {
    let general_key = obj.id;
    $.ajax({
        type: 'POST',
        url: '/del_general',
        data: {
            "general_key": general_key
        },
        success: setTimeout(function () {
            location.reload();
        }, 50),
        dataType: 'json'
    });
}

function delPattern(obj) {
    let pattern_id = obj.id;
    $.ajax({
        type: 'POST',
        url: '/del_pattern',
        data: {
            "pattern_list": pattern_id
        },
        success: setTimeout(function () {
            location.reload();
        }, 50),
        dataType: 'json'
    });
}

function delManyPattern() {
    let patterns = document.getElementsByClassName("table-row");
    let pattern_list = [];
    for (let i = 0; i < patterns.length; i++) {
        if (patterns[i].getElementsByClassName("ai-checkbox-input")[0].checked) {
            pattern_list.push(patterns[i].getElementsByClassName("table-cell template-manage-id")[0].innerHTML);
        }
    }
    $.ajax({
        type: 'POST',
        url: '/del_pattern',
        data: {
            "pattern_list": pattern_list.join(',')
        },
        success: setTimeout(function () {
            location.reload();
        }, 50),
        dataType: 'json'
    });
}

function insertElement(name) {
    $(".cnt-input-edit").focus();
    let sel = window.getSelection();
    let range = sel.getRangeAt(0);
    range.deleteContents();
    if (window.getSelection) {
        if (sel.getRangeAt && sel.rangeCount) {
            let el = document.createElement('div');
            el.innerHTML = name;
            let frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
}

function insertSlot(obj) {
    let slot = obj.id;
    let name = '(?P&lt;' + slot + '&gt;.+?)';
    insertElement(name);
}

function insertFeature(obj) {
    let feature = obj.id;
    let name = '[FEATURE:' + feature + ']';
    insertElement(name);
}

function insertGeneral(obj) {
    let general = obj.id;
    let name = '[GENERAL:' + general + ']';
    insertElement(name);
}

function openDialog() {
    let dialog = document.getElementsByClassName("dialog")[0];
    dialog.style.display = "block";
}

function openDialog2(obj) {
    let dialog = document.getElementsByClassName("dialog2")[0];
    dialog.style.display = "block";
    let feature_key = document.getElementsByClassName("edit-feature-key")[0];
    let feature_value = document.getElementsByClassName("edit-feature-value")[0];
    feature_key.innerHTML = obj.id;
    feature_value.innerHTML = obj.nextSibling.nextSibling.id;
    getFeatureKey();
}

function closeDialog() {
    let dialog = document.getElementsByClassName("dialog")[0];
    dialog.style.display = "none";
}

function closeDialog2() {
    let dialog = document.getElementsByClassName("dialog2")[0];
    dialog.style.display = "none";
}
