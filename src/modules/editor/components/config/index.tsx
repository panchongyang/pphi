import { Form, InputNumber } from "antd";

export interface EditorConfigValue {
  beatDivision: number | null;
}

interface EditorConfigProps {
  value: EditorConfigValue;
  onChange: (value: EditorConfigValue) => void;
}

const EditorConfig: React.FC<EditorConfigProps> = (props) => {
  const { value, onChange } = props;

  const handleChange = <K extends keyof EditorConfigValue>(k: K, value: EditorConfigValue[K]) => {
    onChange({
      ...props.value,
      [k]: value,
    });
  }

  return <Form>
    <Form.Item label="拍子分割">
      <InputNumber
        value={value.beatDivision}
        onChange={(value) => handleChange("beatDivision", value)}
      />
    </Form.Item>
  </Form>
}

export default EditorConfig;