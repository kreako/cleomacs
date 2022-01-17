import CloudSync from "~icons/ic/round-cloud-sync"

type LoadingProps = {
  size: number
  reverseColor?: boolean
}

export default function Loading(props: LoadingProps) {
  const size = `${props.size}em`
  const textColorClassName = props.reverseColor
    ? "text-indigo-50"
    : "text-indigo-600"

  return (
    <CloudSync
      className={`${textColorClassName} animate-pulse`}
      width={size}
      height={size}
    />
  )
}
