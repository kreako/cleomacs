type RawErrorProps = {
  error: Error
}

export default function RawError(props: RawErrorProps) {
  return (
    <div className="mt-6 mb-4 text-red-600 flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center">
        <div className="font-bold tracking-wide">Oh non !</div>
        <div> Il y a eu une erreur :</div>
      </div>
      <div className="font-mono">{props.error.message}</div>
    </div>
  )
}
