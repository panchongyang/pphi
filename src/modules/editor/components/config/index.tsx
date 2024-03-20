import { Form, InputNumber, Slider } from "antd";
import { BEATHEIGHT } from "../../contans";

export interface EditorConfigValue {
  beatDivision: number | null;
  beatHeight: number | null;
}

interface EditorConfigProps {
  value: EditorConfigValue;
  onChange: (value: EditorConfigValue) => void;
}

const EditorConfig: React.FC<EditorConfigProps> = (props) => {
  const { value, onChange } = props;

  const handleChange = <K extends keyof EditorConfigValue>(
    k: K,
    value: EditorConfigValue[K]
  ) => {
    onChange({
      ...props.value,
      [k]: value,
    });
  };

  return (
    <Form>
      <Form.Item label="拍子分割">
        <InputNumber
          value={value.beatDivision}
          onChange={(value) => handleChange("beatDivision", value)}
        />
      </Form.Item>
      <Form.Item label="拍子高度">
        {/* 滑动选择器 */}
        <Slider
          onChange={(value) => {
            handleChange("beatHeight", value);
          }}
          defaultValue={BEATHEIGHT}
          min={40}
          max={2000}
        />
      </Form.Item>
    </Form>
  );
};

export default EditorConfig;
