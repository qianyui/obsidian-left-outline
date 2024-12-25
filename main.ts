import { Plugin, WorkspaceLeaf } from 'obsidian';

export default class LeftOutlinePlugin extends Plugin {
    async onload() {
        // 注册插件加载后的行为
        this.app.workspace.onLayoutReady(() => {
            this.moveOutlineToLeft();
        });

        // 添加命令到命令面板
        this.addCommand({
            id: 'move-outline-to-left',
            name: 'Move Outline to Left Sidebar',
            callback: () => {
                this.moveOutlineToLeft();
            }
        });
    }

    async moveOutlineToLeft() {
        // 查找现有的大纲视图
        let outlineLeaf: WorkspaceLeaf | null = null;
        
        // 在右侧边栏中查找大纲视图
        const rightLeaves = this.app.workspace.getLeavesOfType('outline');
        if (rightLeaves.length > 0) {
            outlineLeaf = rightLeaves[0];
        }

        // 如果找到大纲视图，将其移动到左侧
        if (outlineLeaf) {
            // 创建新的左侧大纲视图
            const newLeaf = this.app.workspace.getLeftLeaf(false);
            if (newLeaf) {
                await newLeaf.setViewState({
                    type: 'outline',
                    active: true
                });
                
                // 关闭原有的大纲视图
                outlineLeaf.detach();
            }
        } else {
            // 如果没有找到现有的大纲视图，创建一个新的
            const leaf = this.app.workspace.getLeftLeaf(false);
            if (leaf) {
                await leaf.setViewState({
                    type: 'outline',
                    active: true
                });
            }
        }
    }

    onunload() {
        // 插件卸载时的清理工作
        this.moveOutlineToRight();
    }

    async moveOutlineToRight() {
        // 查找左侧的大纲视图
        const leftLeaves = this.app.workspace.getLeavesOfType('outline');
        const outlineLeaf = leftLeaves.find(leaf => 
            leaf.getRoot() === this.app.workspace.leftSplit
        );

        if (outlineLeaf) {
            // 创建新的右侧大纲视图
            const newLeaf = this.app.workspace.getRightLeaf(false);
            if (newLeaf) {
                await newLeaf.setViewState({
                    type: 'outline',
                    active: true
                });
                
                // 关闭原有的大纲视图
                outlineLeaf.detach();
            }
        }
    }
}
