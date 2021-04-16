
function StyleExchanger() {
    
    var self = this;
    
    var emptyExchangerList = function(){
        this.list = {};
        this.rlist = {}
    }, exchangerList = new emptyExchangerList();
    
    this.clear = function(){
        exchangerList = new emptyExchangerList;
        return(this);
    }
    
    /**
     * 
     * @param {string} selectorTarget
     * @returns {StyleExchanger}
     */
    this.remove = function(selectorTarget){
        if ( exchangerList[selectorTarget] !== undefined  ){
            var selectorsSource = exchangerList.list[selectorTarget];
            delete exchangerList.list[selectorTarget];
            selectorsSource.forEach(selectorsSource,function(selectorTo){  
                delete exchangerList.rlist[selectorTo];
            });
        }
        return(this);
    };
    
    /**
     * 
     * @param {string} selectorTarget
     * @param {string|Array} selectorSource
     * @returns {StyleExchanger}
     */
    this.add = function(selectorTarget, selectorSource){
        if ( exchangerList.list[selectorTarget] === undefined ){
            exchangerList.list[selectorTarget] = new Array();
        }
        if ( !(selectorSource instanceof Array) ){
            selectorSource = new Array(selectorSource);
        }
        selectorSource.forEach(function(selectorSrc){
            exchangerList.list[selectorTarget].push(selectorSrc);
            exchangerList.rlist[selectorSrc] = selectorTarget;
        });
        return(this);
    };
        
    /**
     * 
     * @returns {StyleExchanger}
     */
    this.execute = function(){
        //https://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSRuleList
        var exchangerRules = {};
        
        var fillExchengerRules = function(sshRule, index){
            var selectorText = sshRule.selectorText;
            for ( var key in exchangerList ){
                var list = exchangerList[key];
                if ( list[selectorText] !== undefined ) {
                    if ( exchangerRules[selectorText] === undefined ) {
                        exchangerRules[selectorText]= new Array();
                    }
                    exchangerRules[selectorText].push( {index: index, rule: sshRule} );
                }
            }
        }
        /**
         * 
         * @param {CSSStyleDeclaration} style
         * @param {CSSStyleDeclaration} style1
         * @returns {StyleExchanger}
         */
        var megre = function(style, style1){
            // style, style1 is CSSStyleDeclaration
            for ( var i = 0 ; i < style1.length; i++){
                var styleName = style1.item(i);
                if ( style1.hasOwnProperty(styleName) || style1[styleName] !== undefined ){
                    var value = style1.getPropertyValue(styleName), priority = style1.getPropertyPriority(styleName);
                    style.setProperty(styleName,value,priority);
                }
            }
            return(this);
        };
        
        for ( var i = 0 ; i < document.styleSheets.length; i++ ){
            var sSheet = document.styleSheets.item(i);
            if ( sSheet.cssRules === null  ) continue;
            for (var j = 0 ; j < sSheet.cssRules.length; j++ ){
                var sshRule = sSheet.cssRules.item(j); 
                fillExchengerRules(sshRule,j);
            }
        }
        
        for ( var target in exchangerList.list ){
            var srcSelectors = exchangerList.list[target];
            var targetRules = exchangerRules[target];
            if (!(targetRules instanceof Array) ){
                throw 'Styles for rule \''+target+'\' not found.';
            }
            for (var i = 0; i < targetRules.length; i++ ){
                var newStyle = document.createElement('span').style;
                for(var j=0; j < srcSelectors.length; j++){
                    var srcRule = exchangerRules[srcSelectors[j]];
                    for (var k=0; k < srcRule.length; k++){
                        megre(newStyle,srcRule[k].rule.style);
                    }
                }
                targetRules[i].rule.style = newStyle.cssText;
            }
        }
        return(this);
    };
        
    
};


