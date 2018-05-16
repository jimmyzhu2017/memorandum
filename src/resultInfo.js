import React, {Component} from 'react'


class ResultInfo extends Component{
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    keyInfo: "",
    valueInfo: "",
    accountInfo: ""
  }

  render() {
    return (
      <div style={{
          width: "70%",
          height: 200,
          marginTop: 50,
          display: "flex",
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <h1 style={{margin: 0,fontSize: 38}}>{this.props.keyInfo}</h1>
          <div style={{backgroundColor: "black",width: "100%",height: 3}}/>
          <h2 style={{margin: 0,fontSize:34,marginLeft: 100}}>{this.props.valueInfo}</h2>
          <h2 style={{margin: 0,alignSelf: 'flex-end'}}>记录者: {this.props.accountInfo}</h2>
      </div>
    )
  }
}

export default ResultInfo
