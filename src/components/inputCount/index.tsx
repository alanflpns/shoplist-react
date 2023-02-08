import styles from "./styles.module.scss";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  quantity: number;
  moreQuantity(): void;
  lessQuantity(): void;
}

export function InputCount({
  quantity,
  moreQuantity,
  lessQuantity,
  ...rest
}: Props) {
  return (
    <div className={styles.countContainer}>
      <button type="button" onClick={lessQuantity} disabled={rest.disabled}>
        -
      </button>
      <input
        {...rest}
        type="number"
        value={quantity}
        pattern="[0-9]*"
        inputMode="numeric"
      />
      <button type="button" onClick={moreQuantity} disabled={rest.disabled}>
        +
      </button>
    </div>
  );
}
