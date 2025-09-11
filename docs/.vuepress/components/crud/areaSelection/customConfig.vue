<template>
  <div>
    <h3>自定义配置</h3>
    <p>区域选择功能提供了丰富的配置选项，可以根据业务需求进行个性化定制。</p>

    <div style="margin-bottom: 20px">
      <el-alert title="配置说明" type="info" :closable="false" show-icon>
        <div>
          <p>• 可以通过配置对象控制各种功能的开启和关闭</p>
          <p>• 支持自定义样式、快捷键、验证规则等</p>
          <p>• 可以配置自定义填充列表、权限控制等高级功能</p>
          <p>• 实时修改配置可以立即看到效果</p>
        </div>
      </el-alert>
    </div>

    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="12">
        <el-card header="基础功能配置">
          <el-form label-width="120px" size="small">
            <el-form-item label="显示区域选择">
              <el-switch
                v-model="config.show"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="启用选择">
              <el-switch
                v-model="config.selection"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="启用复制">
              <el-switch
                v-model="config.copy"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="启用粘贴">
              <el-switch
                v-model="config.paste"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="启用剪切">
              <el-switch
                v-model="config.cut"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="启用填充">
              <el-switch
                v-model="config.fill"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="启用撤销重做">
              <el-switch
                v-model="config.undo"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="高级功能配置">
          <el-form label-width="120px" size="small">
            <el-form-item label="右键菜单">
              <el-switch
                v-model="config.contextMenu"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="粘贴验证">
              <el-switch
                v-model="config.pasteValidation"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="格式保持">
              <el-switch
                v-model="config.formatPreservation"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="多选模式">
              <el-switch
                v-model="config.multiSelection"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="历史记录数">
              <el-input-number
                v-model="config.maxHistorySize"
                :min="10"
                :max="100"
                @change="updateConfig"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="选择延迟(ms)">
              <el-input-number
                v-model="config.selectionDelay"
                :min="0"
                :max="1000"
                @change="updateConfig"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="12">
        <el-card header="样式配置">
          <el-form label-width="120px" size="small">
            <el-form-item label="选择框颜色">
              <el-color-picker
                v-model="config.selectionColor"
                @change="updateConfig"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="边框宽度">
              <el-input-number
                v-model="config.borderWidth"
                :min="1"
                :max="5"
                @change="updateConfig"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="透明度">
              <el-slider
                v-model="config.opacity"
                :min="0.1"
                :max="1"
                :step="0.1"
                @change="updateConfig"
              ></el-slider>
            </el-form-item>
            <el-form-item label="动画效果">
              <el-switch
                v-model="config.animation"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="权限配置">
          <el-form label-width="120px" size="small">
            <el-form-item label="只读模式">
              <el-switch
                v-model="config.readonly"
                @change="updateConfig"
              ></el-switch>
            </el-form-item>
            <el-form-item label="禁用列">
              <el-select
                v-model="config.disabledColumns"
                multiple
                placeholder="选择禁用的列"
                @change="updateConfig"
              >
                <el-option
                  v-for="col in columns"
                  :key="col.prop"
                  :label="col.label"
                  :value="col.prop"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁用行">
              <el-input
                v-model="config.disabledRows"
                placeholder="输入禁用的行号，用逗号分隔"
                @change="updateConfig"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <sc-crud
      ref="crud"
      :data="tableData"
      :search.sync="searchForm"
      :options="options"
      @area-selection-change="handleSelectionChange"
      @area-config-change="handleConfigChange"
    >
    </sc-crud>

    <div style="margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card header="当前配置">
            <div style="height: 200px; overflow-y: auto">
              <pre style="font-size: 11px; margin: 0">{{
                JSON.stringify(currentConfig, null, 2)
              }}</pre>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card header="预设配置">
            <div>
              <el-button
                @click="applyPreset('basic')"
                size="small"
                style="margin-bottom: 10px; width: 100%"
                >基础配置</el-button
              >
              <el-button
                @click="applyPreset('advanced')"
                size="small"
                style="margin-bottom: 10px; width: 100%"
                >高级配置</el-button
              >
              <el-button
                @click="applyPreset('readonly')"
                size="small"
                style="margin-bottom: 10px; width: 100%"
                >只读模式</el-button
              >
              <el-button
                @click="applyPreset('minimal')"
                size="small"
                style="margin-bottom: 10px; width: 100%"
                >最小配置</el-button
              >
              <el-button
                @click="applyPreset('excel')"
                size="small"
                style="width: 100%"
                >Excel模式</el-button
              >
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card header="配置操作">
            <div>
              <el-button
                @click="exportConfig"
                size="small"
                style="margin-bottom: 10px; width: 100%"
                >导出配置</el-button
              >
              <el-button
                @click="importConfig"
                size="small"
                style="margin-bottom: 10px; width: 100%"
                >导入配置</el-button
              >
              <el-button
                @click="resetConfig"
                size="small"
                style="margin-bottom: 10px; width: 100%"
                >重置配置</el-button
              >
              <el-button
                @click="validateConfig"
                size="small"
                style="width: 100%"
                >验证配置</el-button
              >
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 20px">
      <el-card header="自定义填充列表配置">
        <div style="margin-bottom: 15px">
          <el-button @click="addCustomList" size="small" icon="el-icon-plus"
            >添加自定义列表</el-button
          >
        </div>
        <el-table :data="config.fillCustomLists" size="small" border>
          <el-table-column prop="name" label="列表名称" width="150">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.name"
                size="mini"
                @change="updateConfig"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="items" label="列表项">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row.items"
                :key="index"
                closable
                size="mini"
                style="margin-right: 5px; margin-bottom: 5px"
                @close="removeListItem(scope.$index, index)"
              >
                {{ item }}
              </el-tag>
              <el-input
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="mini"
                style="width: 80px"
                @keyup.enter.native="handleInputConfirm(scope.$index)"
                @blur="handleInputConfirm(scope.$index)"
              >
              </el-input>
              <el-button v-else size="mini" @click="showInput(scope.$index)"
                >+ 添加项</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="removeCustomList(scope.$index)"
                size="mini"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 导入配置对话框 -->
    <el-dialog title="导入配置" :visible.sync="importDialogVisible" width="50%">
      <el-input
        type="textarea"
        :rows="10"
        v-model="importConfigText"
        placeholder="请粘贴配置JSON"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CrudAreaSelectionCustomConfig",
  data() {
    return {
      searchForm: {},
      importDialogVisible: false,
      importConfigText: "",
      config: {
        show: true,
        selection: true,
        copy: true,
        paste: true,
        cut: true,
        fill: true,
        undo: true,
        contextMenu: true,
        pasteValidation: true,
        formatPreservation: true,
        multiSelection: false,
        maxHistorySize: 50,
        selectionDelay: 100,
        selectionColor: "#409EFF",
        borderWidth: 2,
        opacity: 0.3,
        animation: true,
        readonly: false,
        disabledColumns: [],
        disabledRows: "",
        fillCustomLists: [
          {
            name: "优先级",
            items: ["低", "中", "高", "紧急"],
            inputVisible: false,
            inputValue: "",
          },
          {
            name: "状态",
            items: ["待处理", "进行中", "已完成", "已取消"],
            inputVisible: false,
            inputValue: "",
          },
        ],
      },
      tableData: [
        {
          id: 1,
          task: "任务1",
          priority: "高",
          status: "进行中",
          assignee: "张三",
          department: "开发部",
          deadline: "2024-01-20",
          progress: 75,
        },
        {
          id: 2,
          task: "任务2",
          priority: "中",
          status: "待处理",
          assignee: "李四",
          department: "测试部",
          deadline: "2024-01-25",
          progress: 0,
        },
        {
          id: 3,
          task: "任务3",
          priority: "低",
          status: "已完成",
          assignee: "王五",
          department: "产品部",
          deadline: "2024-01-15",
          progress: 100,
        },
        {
          id: 4,
          task: "",
          priority: "",
          status: "",
          assignee: "",
          department: "",
          deadline: "",
          progress: "",
        },
        {
          id: 5,
          task: "",
          priority: "",
          status: "",
          assignee: "",
          department: "",
          deadline: "",
          progress: "",
        },
        {
          id: 6,
          task: "",
          priority: "",
          status: "",
          assignee: "",
          department: "",
          deadline: "",
          progress: "",
        },
      ],
    };
  },
  computed: {
    options() {
      return {
        areaSelection: this.currentConfig,
        editConfig: {
          trigger: "click",
          mode: "cell",
        },
        height: "350px",
        renderColumns: [
          {
            prop: "id",
            label: "ID",
            width: 60,
            isEdit: false,
          },
          {
            prop: "task",
            label: "任务",
            width: 120,
            form: {
              comp: {
                name: "el-input",
                placeholder: "请输入任务",
              },
            },
          },
          {
            prop: "priority",
            label: "优先级",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                placeholder: "请选择优先级",
                options: [
                  { label: "低", value: "低" },
                  { label: "中", value: "中" },
                  { label: "高", value: "高" },
                  { label: "紧急", value: "紧急" },
                ],
              },
            },
          },
          {
            prop: "status",
            label: "状态",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                placeholder: "请选择状态",
                options: [
                  { label: "待处理", value: "待处理" },
                  { label: "进行中", value: "进行中" },
                  { label: "已完成", value: "已完成" },
                  { label: "已取消", value: "已取消" },
                ],
              },
            },
          },
          {
            prop: "assignee",
            label: "负责人",
            width: 100,
            form: {
              comp: {
                name: "el-input",
                placeholder: "请输入负责人",
              },
            },
          },
          {
            prop: "department",
            label: "部门",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                placeholder: "请选择部门",
                options: [
                  { label: "开发部", value: "开发部" },
                  { label: "测试部", value: "测试部" },
                  { label: "产品部", value: "产品部" },
                  { label: "设计部", value: "设计部" },
                ],
              },
            },
          },
          {
            prop: "deadline",
            label: "截止日期",
            width: 120,
            form: {
              comp: {
                name: "el-date-picker",
                type: "date",
                placeholder: "请选择截止日期",
                format: "yyyy-MM-dd",
                "value-format": "yyyy-MM-dd",
              },
            },
          },
          {
            prop: "progress",
            label: "进度(%)",
            width: 100,
            form: {
              comp: {
                name: "el-input-number",
                min: 0,
                max: 100,
                step: 5,
                placeholder: "请输入进度",
              },
            },
          },
        ],
      };
    },
    currentConfig() {
      // 处理禁用行配置
      const disabledRows = this.config.disabledRows
        ? this.config.disabledRows
            .split(",")
            .map((row) => parseInt(row.trim()))
            .filter((row) => !isNaN(row))
        : [];

      return {
        ...this.config,
        disabledRows,
        style: {
          selectionColor: this.config.selectionColor,
          borderWidth: this.config.borderWidth + "px",
          opacity: this.config.opacity,
        },
      };
    },
  },
  methods: {
    updateConfig() {
      // 配置更新时的处理
      this.$nextTick(() => {
        if (this.$refs.crud && this.$refs.crud.updateAreaSelectionConfig) {
          this.$refs.crud.updateAreaSelectionConfig(this.currentConfig);
        }
      });
    },

    handleSelectionChange(selectedCells) {
      // 处理选择变化
    },

    handleConfigChange(newConfig) {
      // 处理配置变化
    },

    applyPreset(presetName) {
      const presets = {
        basic: {
          show: true,
          selection: true,
          copy: true,
          paste: true,
          cut: false,
          fill: false,
          undo: false,
          contextMenu: false,
          pasteValidation: false,
          formatPreservation: true,
          multiSelection: false,
          maxHistorySize: 20,
          selectionDelay: 100,
          selectionColor: "#409EFF",
          borderWidth: 2,
          opacity: 0.3,
          animation: true,
          readonly: false,
          disabledColumns: [],
          disabledRows: "",
        },
        advanced: {
          show: true,
          selection: true,
          copy: true,
          paste: true,
          cut: true,
          fill: true,
          undo: true,
          contextMenu: true,
          pasteValidation: true,
          formatPreservation: true,
          multiSelection: true,
          maxHistorySize: 100,
          selectionDelay: 50,
          selectionColor: "#67C23A",
          borderWidth: 3,
          opacity: 0.4,
          animation: true,
          readonly: false,
          disabledColumns: [],
          disabledRows: "",
        },
        readonly: {
          show: true,
          selection: true,
          copy: true,
          paste: false,
          cut: false,
          fill: false,
          undo: false,
          contextMenu: false,
          pasteValidation: false,
          formatPreservation: false,
          multiSelection: false,
          maxHistorySize: 0,
          selectionDelay: 200,
          selectionColor: "#909399",
          borderWidth: 1,
          opacity: 0.2,
          animation: false,
          readonly: true,
          disabledColumns: [
            "task",
            "priority",
            "status",
            "assignee",
            "department",
            "deadline",
            "progress",
          ],
          disabledRows: "",
        },
        minimal: {
          show: true,
          selection: true,
          copy: false,
          paste: false,
          cut: false,
          fill: false,
          undo: false,
          contextMenu: false,
          pasteValidation: false,
          formatPreservation: false,
          multiSelection: false,
          maxHistorySize: 0,
          selectionDelay: 100,
          selectionColor: "#E6A23C",
          borderWidth: 1,
          opacity: 0.2,
          animation: false,
          readonly: false,
          disabledColumns: [],
          disabledRows: "",
        },
        excel: {
          show: true,
          selection: true,
          copy: true,
          paste: true,
          cut: true,
          fill: true,
          undo: true,
          contextMenu: true,
          pasteValidation: true,
          formatPreservation: true,
          multiSelection: true,
          maxHistorySize: 50,
          selectionDelay: 0,
          selectionColor: "#409EFF",
          borderWidth: 2,
          opacity: 0.3,
          animation: false,
          readonly: false,
          disabledColumns: [],
          disabledRows: "",
        },
      };

      if (presets[presetName]) {
        Object.assign(this.config, presets[presetName]);
        this.updateConfig();
        this.$message.success(`已应用${presetName}预设配置`);
      }
    },

    exportConfig() {
      const configJson = JSON.stringify(this.currentConfig, null, 2);
      const blob = new Blob([configJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "areaSelection-config.json";
      a.click();
      URL.revokeObjectURL(url);
      this.$message.success("配置已导出");
    },

    importConfig() {
      this.importDialogVisible = true;
    },

    confirmImport() {
      try {
        const importedConfig = JSON.parse(this.importConfigText);
        Object.assign(this.config, importedConfig);
        this.updateConfig();
        this.importDialogVisible = false;
        this.importConfigText = "";
        this.$message.success("配置导入成功");
      } catch (error) {
        this.$message.error("配置格式错误，请检查JSON格式");
      }
    },

    resetConfig() {
      this.$confirm("确定要重置所有配置吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 重置为默认配置
        this.applyPreset("basic");
        this.$message.success("配置已重置");
      });
    },

    validateConfig() {
      const errors = [];

      if (this.config.maxHistorySize < 0 || this.config.maxHistorySize > 200) {
        errors.push("历史记录数应在0-200之间");
      }

      if (this.config.selectionDelay < 0 || this.config.selectionDelay > 2000) {
        errors.push("选择延迟应在0-2000ms之间");
      }

      if (this.config.borderWidth < 1 || this.config.borderWidth > 10) {
        errors.push("边框宽度应在1-10px之间");
      }

      if (this.config.opacity < 0.1 || this.config.opacity > 1) {
        errors.push("透明度应在0.1-1之间");
      }

      if (errors.length > 0) {
        this.$message.error("配置验证失败：" + errors.join("；"));
      } else {
        this.$message.success("配置验证通过");
      }
    },

    addCustomList() {
      this.config.fillCustomLists.push({
        name: "新列表",
        items: [],
        inputVisible: false,
        inputValue: "",
      });
      this.updateConfig();
    },

    removeCustomList(index) {
      this.config.fillCustomLists.splice(index, 1);
      this.updateConfig();
    },

    showInput(listIndex) {
      this.$set(this.config.fillCustomLists[listIndex], "inputVisible", true);
      this.$nextTick(() => {
        this.$refs.saveTagInput[listIndex].$refs.input.focus();
      });
    },

    handleInputConfirm(listIndex) {
      const list = this.config.fillCustomLists[listIndex];
      const inputValue = list.inputValue;
      if (inputValue && !list.items.includes(inputValue)) {
        list.items.push(inputValue);
      }
      list.inputVisible = false;
      list.inputValue = "";
      this.updateConfig();
    },

    removeListItem(listIndex, itemIndex) {
      this.config.fillCustomLists[listIndex].items.splice(itemIndex, 1);
      this.updateConfig();
    },
  },
};
</script>

<style scoped>
.el-alert {
  margin-bottom: 20px;
}

.el-alert p {
  margin: 2px 0;
  font-size: 13px;
}

.el-card {
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}

pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
