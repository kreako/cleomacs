import CloudSync from "~icons/ic/round-cloud-sync"

type LoadingProps = {
  size: number
}

export default function Loading(props: LoadingProps) {
  const size = `${props.size}em`
  return (
    <CloudSync
      className="text-indigo-600 animate-pulse"
      width={size}
      height={size}
    />
  )
}
