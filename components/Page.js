import { useDispatch, useSelector } from "react-redux"

const Page = () => {
  const dispatch = useDispatch()
  const { currentUser, loader } = useSelector(state => state.user)

  return (
    <div>
      {loader && <div>Loading...</div>}
      {currentUser &&
        <div>
          <h3>User</h3>
          <p>name: {currentUser.name}</p>
          <p>email: {currentUser.email}</p>
        </div>
      }
      {!loader && !currentUser &&
        <div>No user found!</div>
      }
      <style jsx>{`
        div {
          margin-top: 30px;
        }

      `}</style>
    </div>
  )
}

export default Page
