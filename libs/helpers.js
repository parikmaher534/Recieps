var util = require('util'),
    Helpers = {};

Helpers.extend = function(base, _props, dontCopyProps, recursiveCopyProps) {
    var result,
        props = {};

    recursiveCopyProps = recursiveCopyProps || [];

    Object.keys(_props).forEach(function(propName) {
        var newprop,
            prop = _props[propName];

        if (typeof prop === 'function') {
            newprop = function() {
                var result,
                    tmp = this._super;

                this._super = base[propName] || function() {};
                result = prop.apply(this, arguments);
                this._super = tmp;

                return result;
            }
        }
        else {
            newprop = prop;
        }

        if (!~recursiveCopyProps.indexOf(propName)) {
            props[propName] = {
                value: newprop,
                writable: true,
                enumerable: true,
                configurable: true
            };
        }

        recursiveCopyProps.forEach(function(propName) {
            props[propName] = {
                value: copyRecursiveProp(base, _props, propName),
                writable: true,
                enumerable: true,
                configurable: true
            };
        });
    });

    if (dontCopyProps) {
        Object.keys(dontCopyProps).forEach(function(propName) {
            if (!props.hasOwnProperty(propName)) {
                props[propName] = {
                    value: dontCopyProps[propName],
                    writable: true,
                    enumerable: true,
                    configurable: true
                }; // TODO: clone ?
            }
        });
    }

    function copyRecursiveProp(base, props, propName) {
        var result, baseKeys, newKeys,
            baseProp = base[propName],
            newProp = props[propName];

        if (props.hasOwnProperty(propName)) {
            if (isNativeObject(newProp)) {
                if (base.hasOwnProperty(propName) && isNativeObject(baseProp)) {
                    baseKeys = Object.keys(baseProp);
                    newKeys = Object.keys(newProp);

                    result = {};

                    newKeys.forEach(function(newKey) {
                        result[newKey] = copyRecursiveProp(baseProp, newProp, newKey);
                    });

                    baseKeys.forEach(function(baseKey) {
                        if (!result.hasOwnProperty(baseKey)) result[baseKey] = baseProp[baseKey];
                    });
                }
                else {
                    result = newProp;
                }
            }
            else {
                result = newProp;
            }
        }
        else {
            result = base.hasOwnProperty(propName) ? base[propName] : null;
        }

        return result;
    }

    function isNativeObject(obj) { // !!!
        return typeof obj === 'object' && !util.isArray(obj) && obj !== null;
    }

    result = Object.create(base, props);

    return result;
};

Helpers.extendController = function(base, props, recursiveCopyProps) {
    return Helpers.extend(base, props, {
        name: null,
        isAbstract: false,
        init: null
    }, recursiveCopyProps || null);
};

Helpers.extendCRUDController = function(base, props) {
    return Helpers.extendController(base, props, ['proxy', 'create', 'read', 'update', 'delete']);
};

Helpers.getArray = function(obj) {
    return [].concat(obj || []);
};

Helpers.comparator =  function(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
};
Helpers.getStringDate = function(timestamp, isRetTime){
    var date = new Date(parseInt(timestamp, 10)), res;

    var month =  date.getMonth() + 1;
    res =  (month<10?'0':'') + month + "/" + (date.getDate()<10?'0':'') + date.getDate()+ "/" + date.getFullYear();
    if(isRetTime){
        res +=  " " + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
    }
    return res;
};
Helpers.getTimestamp = function(dateStr){
    var dateArr = dateStr.split('/'), date = new Date();
    date.setDate(parseInt(dateArr[1]));
    date.setDate(dateArr[1]);
    date.setMonth(parseInt(dateArr[0]));
    date.setYear(parseInt(dateArr[2]));
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
};


Helpers.defineListAccess = function(result, storage){
    var rights = {},
        listAccess = result.customize_access;

    /*View access*/
    rights.canView = false;
    if(listAccess.content_review === 2 || storage.is_owner){
        rights.canView = true;
    } else if(listAccess.content_review === 1 && storage.isAuthorized){
        rights.canView = true;
    }

    /*Add access*/
    rights.canAdd = false;
    if(listAccess.content_add === 2 || storage.is_owner){
        rights.canAdd = true;
    } else if(listAccess.content_add === 1 && storage.isAuthorized){
        rights.canAdd = true;
    }
    /*Edit access*/
    rights.canEdit = false;
    if(listAccess.content_edit === 2 || storage.is_owner){
        rights.canEdit = true;
    } else if(listAccess.content_edit === 1 && storage.isAuthorized){
        rights.canEdit = true;
    }

    /**Delete access**/
    rights.canDelete = false;
    if(listAccess.content_delete === 2 || storage.is_owner){
        rights.canDelete = true;
    } else if(listAccess.content_delete === 1 && storage.isAuthorized){
        rights.canDelete = true;
    }

    /*Comment and rate*/

    rights.canComment = false;
    rights.canRate = false;
    if(storage.is_owner  || (listAccess.comment_and_rate ===  1 && storage.isAuthorized)){
        rights.canComment = true;
        rights.canRate = true;
    } else if (listAccess.comment_and_rate === 2 && storage.isAuthorized){
        rights.canComment = true
    } else if (listAccess.comment_and_rate === 3 && storage.isAuthorized) {
        rights.canRate = true;
    }
    else if (listAccess.comment_and_rate === 0) {
        rights.canComment = true;
    }


    result.access = rights;
    return false;
};
Helpers.rebuildFilterValues = function(valuesList){
    valuesList.forEach(function(value, index, array){
        if(!value.fieldValues.length){
            return;
        }
        var type = value.fieldType.toLowerCase();
        if(value.fieldType.toLowerCase() === 'date' || value.fieldType.toLowerCase() === 'number'){
            var maxValObj = _.max(value.fieldValues, function(item){ return item.value}),
                minValObj = _.min(value.fieldValues, function(item){ return item.value}),
                minVal = minValObj.value,
                maxVal = maxValObj.value;
            if('date' === type){
                array[index].isDate = true;
                minValObj.value = helpers.getStringDate(minVal);
                maxValObj.value = helpers.getStringDate(maxVal);
                minValObj.label ='From';
                maxValObj.label = 'to';
            }
            if('number' === type){
                minValObj.label = 'Min';
                maxValObj.label = 'Max';
            }
            array[index].fieldValues = [];
            array[index].fieldValues.push(minValObj, maxValObj);
            array[index].isRange = true;

        }

    });
};

Helpers.parseQuery = function(filtersStr){
    if(!filtersStr) return false;
    var fArr, result = [];
    fArr = filtersStr.split(';');
    fArr.pop();
    fArr.forEach(function(filter){
        result.push(JSON.parse(filter));
    });
    return result;
};

Helpers.buildFiltersQuery = function(queryDB, fQuery, fields){
    var customFieldsAllowedTypes = ["Text", "Select", "Checkbox", "Number", "Date", "Date-range", "Link"],
        defaultSearchFields = [],
        resQuery = queryDB;
    if(fQuery){
        fields.forEach(function(listCustomField) {
            if (listCustomField && listCustomField.isShowInSearchForm && customFieldsAllowedTypes.indexOf(listCustomField.type) != -1) {
                defaultSearchFields.push({field : "custom_" + listCustomField._id, type : listCustomField.type});
            }
        });

        defaultSearchFields.forEach(function(field){
            fQuery.forEach(function(query){
                if(!_.isUndefined(query[field.field])){
                    if( field.type.toLocaleLowerCase() == 'date' || field.type.toLocaleLowerCase() == 'number' ){
                        resQuery[field.field] = {$gte : +query[field.field][0], $lte : +query[field.field][1]}
                    }
                    else {
                        if(  _.isNumber(query[field.field]) ) {
                            resQuery[field.field] = {$in: +query[field.field]};
                        } else if ( _.isBoolean(query[field.field]) ) {
                            resQuery[field.field] = {$in: Boolean(query[field.field])};
                        } else {
                            resQuery[field.field] = {$in: query[field.field]};
                        }
                    }
                }
            })

        });

    }
    return resQuery;
};

Helpers.parseOutputContent = function(content) {
    if (!content) return content;
    if ('' == content || 'undefined' == typeof(content)) return content;
//  var link_pattern = /\b(?:(?:https?|ftp|file):\/\/www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#‌​\/%=~_|$]/i;
    var url_pattern = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig;
    content = content.replace(url_pattern, function(result) {
//      var result = '<a href="'+result+'">'+result+'</a>';
        return '<a href="'+result+'" target="_blank" class="link_location">'+result+'</a>';
    });
    return content;
}

module.exports = Helpers;