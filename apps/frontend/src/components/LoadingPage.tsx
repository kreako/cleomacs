import Loading from "./Loading"

export default function LoadingPage() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 place-items-center h-screen">
      <div className="col-start-2 row-start-2 ">
        <Loading size={2} />
      </div>
    </div>
  )
}
