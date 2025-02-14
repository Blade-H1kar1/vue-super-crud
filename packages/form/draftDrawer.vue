<template>
  <el-drawer
    title="草稿箱"
    :visible.sync="draftVisible"
    direction="rtl"
    size="600"
    :append-to-body="true"
    :destroy-on-close="false"
  >
    <div :class="b()">
      <!-- 顶部操作区 -->
      <div class="draft-header">
        <div class="draft-header__left">
          <el-tooltip content="清空草稿箱" placement="top">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleClearDraft"
            >
            </el-button>
          </el-tooltip>
        </div>
        <div class="draft-header__right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索草稿"
            prefix-icon="el-icon-search"
            clearable
            size="small"
          />
        </div>
      </div>

      <!-- 草稿列表 -->
      <div class="draft-list">
        <el-empty
          v-if="!filteredDraftList.length"
          description="暂无草稿"
        ></el-empty>

        <div
          v-else
          v-for="draft in filteredDraftList"
          :key="draft.id"
          class="draft-item"
        >
          <div class="draft-item__header">
            <span class="draft-item__name">{{ draft.name }}</span>
            <span class="draft-item__time">{{
              formatTime(draft.updateTime)
            }}</span>
          </div>

          <div class="draft-item__footer">
            <el-button type="text" size="mini" @click="handleLoadDraft(draft)">
              加载当前
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleLoadDraft(draft, true)"
            >
              完整加载
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handlePreviewDraft(draft)"
            >
              预览
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDeleteDraft(draft.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import cache from "utils/cache.js";
import { create } from "core";
export default create({
  name: "form-draft",
  inject: ["formCtx"],
  props: {
    // 添加尺寸属性
    size: {
      type: String,
      default: "medium",
      validator: (value) =>
        ["default", "medium", "small", "mini"].includes(value),
    },
  },
  data() {
    return {
      isExpanded: false,
      shouldExpandHorizontal: false,
      hideTimer: null,
      draftList: [],
      draftVisible: false,
      searchKeyword: "",
    };
  },

  created() {
    this.loadDraftsFromStorage();
  },

  computed: {
    filteredDraftList() {
      if (!this.searchKeyword) {
        return this.draftList;
      }
      const keyword = this.searchKeyword.toLowerCase();
      return this.draftList.filter((draft) =>
        draft.name.toLowerCase().includes(keyword)
      );
    },
    draftNumber() {
      return this.draftList.length;
    },
  },

  methods: {
    handleMouseEnter() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }
      this.isExpanded = true;
    },
    handleMouseLeave() {
      this.hideTimer = setTimeout(() => {
        this.isExpanded = false;
      }, 200);
    },
    handleDraft() {
      this.draftVisible = true;
    },

    handleSaveDraft() {
      this.$prompt("请输入草稿名称", "保存草稿", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S+/, // 不允许空白字符
        inputErrorMessage: "草稿名称不能为空",
        inputValue: `草稿_${new Date().toLocaleString()}`, // 默认名称
      }).then(({ value: draftName }) => {
        try {
          // 创建新的草稿对象
          const draft = {
            id: `draft_${Date.now()}`, // 使用时间戳生成唯一ID
            name: draftName.trim(),
            formData: JSON.parse(JSON.stringify(this.formCtx.value)), // 深拷贝表单数据
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
          };

          // 获取现有草稿列表
          const drafts = [...this.draftList];

          // 检查是否存在同名草稿
          const existingIndex = drafts.findIndex(
            (item) => item.name === draft.name
          );

          if (existingIndex !== -1) {
            // 如果存在同名草稿，提示用户是否覆盖
            return this.$confirm("已存在同名草稿，是否覆盖？", "提示", {
              type: "warning",
              confirmButtonText: "覆盖",
              cancelButtonText: "取消",
            })
              .then(() => {
                // 覆盖已有草稿
                drafts[existingIndex] = draft;
                this.saveDraftsToStorage(drafts);
                this.$message.success("草稿已更新");
              })
              .catch(() => {
                // 用户取消覆盖，重新调用保存方法
                this.handleSaveDraft();
              });
          }

          // 添加新草稿到列表开头
          drafts.unshift(draft);

          // 保存到本地存储
          this.saveDraftsToStorage(drafts);

          // 更新组件数据
          this.draftList = drafts;

          this.$message.success("保存成功");
        } catch (error) {
          console.error("保存草稿失败:", error);
          this.$message.error("保存失败：" + error.message);
        }
      });
    },

    // 保存草稿列表到本地存储
    saveDraftsToStorage(drafts) {
      try {
        if (!this.$route) return;
        let draftsStr = cache.local.getJSON("SC_FORM_DRAFTS") || {};
        draftsStr[this.$route.path] = drafts;
        cache.local.setJSON("SC_FORM_DRAFTS", draftsStr);
      } catch (error) {
        console.error("保存到本地存储失败:", error);
        throw new Error("保存到本地存储失败");
      }
    },

    // 从本地存储加载草稿列表
    loadDraftsFromStorage() {
      try {
        const cacheData = cache.local.getJSON("SC_FORM_DRAFTS") || {};
        this.draftList = cacheData[this.$route.path] || [];
      } catch (error) {
        console.error("加载草稿列表失败:", error);
        this.draftList = [];
      }
    },

    async handleLoadDraft(draft, loadAll = false) {
      if (!draft) {
        draft = this.filteredDraftList[0];
      }
      if (!draft) return;
      try {
        // 更新表单数据
        const formData = JSON.parse(JSON.stringify(draft.formData));
        let newFormData;
        if (loadAll) {
          // 加载全部字段
          newFormData = formData;
        } else {
          // 只更新表单中存在的字段
          const currentFormData = { ...this.formCtx.value };
          const updates = await this.formCtx.filterDisabledData(formData);
          newFormData = { ...currentFormData, ...updates };
        }

        // 更新表单数据
        this.formCtx.$emit("input", newFormData);

        // 更新草稿的使用时间
        const updatedDraft = {
          ...draft,
          updateTime: new Date().toISOString(),
        };

        // 更新草稿列表中的数据
        const draftIndex = this.draftList.findIndex(
          (item) => item.id === draft.id
        );
        if (draftIndex !== -1) {
          this.draftList.splice(draftIndex, 1);
          this.draftList.unshift(updatedDraft);
          // 保存更新后的草稿列表
          this.saveDraftsToStorage(this.draftList);
        }

        // 关闭草稿箱
        this.draftVisible = false;

        // 清除表单验证状态
        this.formCtx.clearValidate();

        // 提示成功
        this.$message.success("加载成功");

        // 触发加载草稿事件
        this.formCtx.$emit("draft-loaded", draft);
      } catch (error) {
        console.error("加载草稿失败:", error);
        this.$message.error("加载失败：" + error.message);
      }
    },

    // 添加草稿数据验证方法
    validateDraftData(draftData) {
      // 检查必要的字段
      if (!draftData || typeof draftData !== "object") {
        return false;
      }

      // 检查是否至少有一个有效字段
      const hasValidField = this.formCtx.trueRenderColumns.some(
        (column) => draftData[column.prop] !== undefined
      );

      return hasValidField;
    },

    handleDeleteDraft(draftId) {
      // 确认是否删除草稿
      this.$confirm("确认删除该草稿？删除后将无法恢复", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          try {
            // 获取要删除的草稿
            const draftIndex = this.draftList.findIndex(
              (item) => item.id === draftId
            );
            if (draftIndex === -1) return;

            // 从列表中移除草稿
            const deletedDraft = this.draftList[draftIndex];
            this.draftList.splice(draftIndex, 1);

            // 保存更新后的草稿列表到本地存储
            this.saveDraftsToStorage(this.draftList);
            // 触发删除事件
            this.formCtx.$emit("draft-deleted", deletedDraft);

            // 如果草稿列表为空，可以自动关闭抽屉
            if (this.draftList.length === 0) {
              this.draftVisible = false;
            }
          } catch (error) {
            console.error("删除草稿失败:", error);
          }
        })
        .catch(() => {
          // 用户取消删除，不做处理
        });
    },

    handleClearDraft() {
      this.$confirm("确认清空草稿箱？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.draftList = [];
        this.saveDraftsToStorage([]);
      });
    },
    // 格式化时间显示
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
    // 添加预览草稿方法
    handlePreviewDraft(draft) {
      // 创建 prop 到 label 的映射
      const propToLabelMap = this.formCtx.trueRenderColumns.reduce(
        (map, col) => {
          map[col.prop] = col.label || col.prop;
          return map;
        },
        {}
      );

      // 格式化显示数据
      const formattedData = Object.entries(draft.formData)
        .map(([key, value]) => {
          const label = propToLabelMap[key] || key;
          // 处理不同类型的值的显示
          let displayValue = value;
          if (Array.isArray(value)) {
            displayValue = JSON.stringify(value);
          } else if (typeof value === "object" && value !== null) {
            displayValue = JSON.stringify(value);
          } else if (value === "" || value === null || value === undefined) {
            displayValue = "空";
          }
          return `${label}: ${displayValue}`;
        })
        .join("\n");
      this.$alert(formattedData, "草稿预览", {
        confirmButtonText: "关闭",
        customClass: "sc-form-draft__preview-dialog",
        callback: () => {},
      });
    },
  },
});
</script>
