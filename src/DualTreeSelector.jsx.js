/**
 * @file 双树选择器。
 * @author Han Bing Feng (hanbingfeng@baidu.com)
 */

define(function (require) {
    var _ = require('underscore');
    var React = require('react');
    var Tree = require('./Tree.jsx');
    var treeUtil = require('./core/treeUtil.es6');

    var DualTreeSelector = React.createClass({
        propTypes: {
            /**
             * 全部可选节点的列表
             */
            treeNodes: React.PropTypes.arrayOf(Tree.treeNodeType),
            /**
             * 左子树的宽度，px
             */
            leftTreeWidth: React.PropTypes.number,
            /**
             * 右子树的宽度，px
             */
            rightTreeWidth: React.PropTypes.number,
            /**
             * 选择器中树的高度，px
             */
            height: React.PropTypes.number,
            /**
             * 左树的标题
             */
            leftTreeTitle: React.PropTypes.string,
            /**
             * 右树的标题
             */
            rightTreeTitle: React.PropTypes.string,
            /**
             * 左树左下角的提示话术
             */
            textLeftTreeSummary: React.PropTypes.string,
            /**
             * 右树的节点叶子限制
             */
            rightTreeLimit: React.PropTypes.number,
            /**
             * 已选节点的id集合
             */
            selectedTreeNodeId: React.PropTypes.objectOf(React.PropTypes.bool),
            /**
             * 当所做选择会使得右树超量时的回调，参数为超量后的右树叶子数
             */
            onRightTreeOverLimit: React.PropTypes.func,
            /**
             * 树节点选择动作开始前的回调，参数为被移动节点，可返回true阻止选择发生
             */
            beforeTreeNodeSelect: React.PropTypes.func,
            /**
             * 当树节点选择动作完成时的回调，参数为被移动节点
             */
            afterTreeNodeSelect: React.PropTypes.func,
            /**
             * 左树节点展开时的回调
             */
            onLeftTreeNodeExpand: React.PropTypes.func
        },

        getInitialState: function () {
            return {
                selectedTreeNodeId: this.props.selectedTreeNodeId || {}
            };
        },

        componentWillMount: function () {
            this.updateCache();
        },

        componentWillReceiveProps: function (nextProps) {
            this.setState(_.pick(nextProps, 'selectedTreeNodeId'));
            this.updateCache();
        },

        getDefaultProps: function () {
            return {
                leftTreeWidth: 310,
                rightTreeWidth: 310,
                height: 380,
                leftTreeTitle: '可选项目',
                rightTreeTitle: '已选项目',
                onLeftTreeNodeExpand: _.noop
            };
        },

        updateCache: function () {
            this._cache = treeUtil.getCache(this.props.treeNodes);
        },

        selectTreeNode: function (selectedTreeNode) {
            if (this.props.beforeTreeNodeSelect) {
                if (this.props.beforeTreeNodeSelect.call(this, selectedTreeNode)) {
                    return;
                }
            }

            var selectedTreeNodeId = treeUtil.markTreeNodeSelected(
                selectedTreeNode, this.state.selectedTreeNodeId, this._cache.parentCache
            );

            if (this.props.rightTreeLimit != null) {
                var count = Object.keys(selectedTreeNodeId).reduce((count, nodeId) => {
                    var node = this._cache.nodeCache[nodeId];
                    if (node && (!node.children || node.children.length === 0)) {
                        return ++count;
                    }
                    return count;
                }, 0);
                if (count > this.props.rightTreeLimit) {
                    this.props.onRightTreeOverLimit && this.props.onRightTreeOverLimit(count);
                    return;
                }
            }

            // 同时让挪到右边的节点都展开，将新加入的节点id加入expanded tree node id
            var expandedTreeNodeId = this.refs.rightTree.state.expandedTreeNodeId;
            var newAdded = _.difference(selectedTreeNodeId, this.state.selectedTreeNodeId);
            var newExpanded = {};
            var treeNodes = treeUtil.getMarkedTreeNodes(
                this.props.treeNodes, newAdded, this._cache.parentCache, this._cache.nodeCache
            );
            treeUtil.walk((node) => {
                newExpanded[node.id] = true;
            }, treeNodes);
            this.setState({
                selectedTreeNodeId: selectedTreeNodeId
            }, () => {
                this.props.afterTreeNodeSelect && this.props.afterTreeNodeSelect.call(this, selectedTreeNode);
            });
            this.refs.rightTree.setState({
                expandedTreeNodeId: _.extend(newExpanded, expandedTreeNodeId)
            });
        },

        unselectTreeNode: function (unselectTreeNode, from) {
            this.setState({selectedTreeNodeId: treeUtil.unmarkTreeNodeSelected(
                unselectTreeNode, this.state.selectedTreeNodeId, this._cache.parentCache
            )});
        },

        removeAll: function (from) {
            if (from === 'left') {
                throw new Error('从左树移除节点尚不支持。');
            }
            else {
                this.setState({selectedTreeNodeId: {}});
            }
        },

        render: function () {
            var {
                leftTreeWidth,
                rightTreeWidth,
                leftTreeTitle,
                rightTreeTitle,
                height,
                textLeftTreeSummary
            } = this.props;

            var selectedTreeNodes = treeUtil.getMarkedTreeNodes(
                this.props.treeNodes, this.state.selectedTreeNodeId, this._cache.parentCache, this._cache.nodeCache
            );

            return <div className='fcui2-dual-tree-selector'>
                <div className='fcui2-dual-tree-selector-left-tree-wrapper'>
                    <div className="fcui2-dual-tree-selector-tree-title">{leftTreeTitle}</div>
                    <Tree style={{width: leftTreeWidth, height: height}}
                        treeNodes={this.props.treeNodes}
                        markedTreeNodeId={this.state.selectedTreeNodeId}
                        onTreeNodeOperationClicked={(treeNode) => {
                            this.selectTreeNode(treeNode);
                        }}
                        onTreeNodeExpandClicked={this.props.onLeftTreeNodeExpand.bind(this)}
                        ref='leftTree' />
                    <div className='fcui2-dual-tree-selector-tree-footer'>
                        <span className='fcui2-dual-tree-selector-tree-footer-summary'>{textLeftTreeSummary}</span>
                    </div>
                </div>
                <div className='fcui2-dual-tree-selector-separator' style={{lineHeight: height + 'px'}}></div>
                <div className='fcui2-dual-tree-selector-right-tree-wrapper'>
                    <div className='fcui2-dual-tree-selector-tree-title'>{rightTreeTitle}</div>
                    <Tree style={{width: rightTreeWidth, height: height}}
                        treeNodes={selectedTreeNodes}
                        onTreeNodeOperationClicked={(treeNode) => {
                            this.unselectTreeNode(treeNode);
                        }}
                        ref='rightTree' />
                    <div className='fcui2-dual-tree-selector-tree-footer'>
                        <span className='fcui2-dual-tree-selector-tree-footer-summary'>
                            {treeUtil.countLeaf(selectedTreeNodes)}
                            {this.props.rightTreeLimit
                                ? ' / ' + this.props.rightTreeLimit
                                : ''}
                        </span>
                        <span className='fcui2-dual-tree-selector-tree-footer-remove-all'>
                            <a href='javascript:;' onClick={() => {
                                this.removeAll('right');
                            }}>全部删除</a>
                        </span>
                    </div>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>;
        }
    });

    return DualTreeSelector;
});
