import CloudSync from "~icons/ic/round-cloud-sync"

export default function Loading() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 place-items-center h-screen">
      <div className="col-start-2 row-start-2 ">
        <CloudSync
          className="text-indigo-600 animate-pulse"
          width="2em"
          height="2em"
        />
      </div>
    </div>
  )
}
