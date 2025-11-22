import { CoreSystemPrompts, ModuleType } from "./types";

export const SOULSLIKE_MODULES: CoreSystemPrompts = {
  [ModuleType.CHARACTER_BASE]: {
    title: "角色基础框架 (Character Base)",
    prompt: "请为当前选择的 Unreal Engine 版本创建一个魂类游戏基础角色类 (ASoulCharacter)。包含：\n1. 头文件 (.h) 和源文件 (.cpp) 结构。\n2. 适配当前版本的输入绑定（如 Enhanced Input）。\n3. 核心属性：生命值 (Health)、精力值 (Stamina) 的定义。\n4. 用于管理状态（如是否在攻击、是否在翻滚）的 boolean 或 GameplayTag 接口。",
    icon: "user",
    description: "生成包含移动、属性和输入绑定的核心 C++ 类。"
  },
  [ModuleType.COMBAT_SYSTEM]: {
    title: "战斗系统 (Combat System)",
    prompt: "请实现一个基于 UE C++ 的魂类战斗核心。需要：\n1. 轻攻击与重攻击的函数入口。\n2. 简单的连招计数器 (Combo Counter) 逻辑。\n3. 消耗精力值的检查函数 (CanAttack)。\n4. 武器碰撞检测的思路（推荐使用 LineTrace 或 Collision Profile）。",
    icon: "sword",
    description: "攻击逻辑、连招处理与伤害检测基础。"
  },
  [ModuleType.AI_BOSS]: {
    title: "Boss AI 框架 (Boss AI)",
    prompt: "请设计一个简单的魂类 Boss AI 架构。包括：\n1. AIController 类定义。\n2. 行为树 (Behavior Tree) 的主要节点建议 (Selector/Sequence)。\n3. 一个 C++ 自定义 Task 示例：用于执行特定攻击（如跳劈）。\n4. 感知组件 (AIPerception) 的初始化代码。",
    icon: "skull",
    description: "行为树、AIController 与感知系统配置。"
  },
  [ModuleType.INVENTORY]: {
    title: "物品与装备 (Inventory)",
    prompt: "请构建一个轻量级的物品系统。需要：\n1. UItemBase 数据资产类 (UDataAsset) 用于定义物品属性。\n2. UInventoryComponent 组件类，用于管理角色背包。\n3. 添加、移除物品的函数声明。\n4. 装备武器时的逻辑（AttachToComponent 到 Socket）。",
    icon: "backpack",
    description: "基于 DataAsset 的物品定义与背包组件。"
  }
};