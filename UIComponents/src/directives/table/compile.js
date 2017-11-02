/**
 * @file compile directive
 * @author zhangyou04@baidu.com
 */
// import angular from 'angular';

class CellCompileDirective {
    constructor($compile) {
        this.restrict = 'A';
        this.scope = {
            col: '=',
            row: '='
        };
        this.$compile = $compile;
    }

    link(scope, element, attrs) {
        scope.$watch(
            attrs.cellCompile,
            newVal => {
                if (newVal) {
                    if (angular.isFunction(element.empty)) {
                        element.empty();
                    }
                    else {
                        element.html('');
                    }

                    element.append(this.$compile(newVal)(scope));
                }
            }
        );
    }

    static getInstance($compile) {
        CellCompileDirective.instance = new CellCompileDirective($compile);
        return CellCompileDirective.instance;
    }
}

CellCompileDirective.getInstance.$inject = ['$compile'];

export default angular.module('directives.cellCompile', [])
    .directive('cellCompile', CellCompileDirective.getInstance)
    .name;
