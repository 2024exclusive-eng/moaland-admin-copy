import Logo from "@assets/images/logo.png"

const SpinnerComponent = () => {
  return (
    <div className='fallback-spinner app-loader'>
      <img src={Logo} width={78} height={16} alt="logo" />
      <div className='loading'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
    </div>
  )
}

export default SpinnerComponent
