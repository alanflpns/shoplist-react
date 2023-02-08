import "./styles.module.scss";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  noBorder?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function Input({ noBorder, inputRef, ...rest }: Props) {
  return (
    <input
      placeholder="Insira o nome"
      ref={inputRef}
      style={{ border: noBorder ? "none" : "", width: rest.width || "" }}
      {...rest}
    />
  );
}
