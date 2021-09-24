import { GroupBase } from "react-select";
import Select,  { AsyncProps } from "react-select/async";

export function SelectSearch<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: AsyncProps<Option, IsMulti, Group>) {
  return (
    <Select {...props} theme={(theme) => ({ ...theme })} />
  );
}