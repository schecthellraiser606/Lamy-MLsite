// import { userState } from "../../store/userState";
// import { useRouter } from "next/router"
// import { useEffect } from "react"
// import { useRecoilValue } from "recoil";

// export const useAccessControll = () => {
//   const signInUser = useRecoilValue(userState)
//   const router = useRouter()
//   useEffect(() => {
//     if (/^\/login/.test(router.asPath) && signInUser.id)
//       router.replace({
//         pathname: "/mypage/[id]",
//         query: { id: signInUser.id },
//       })
//     // if (/^\/mypage/.test(router.asPath) && !signInUser.id)
//     //   router.replace('/login')
//     if (/^\/thread/.test(router.asPath) && !signInUser.id)
//       router.replace('/login')
//   }, [router, signInUser])
// }
