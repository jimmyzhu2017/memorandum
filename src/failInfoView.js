import React,{Component} from 'react'

class FailInfoView extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    searchText: "",
    addFunc: () => {}
  }

  render() {

    return (
      <div style={{display: "flex",marginTop: 50}}>
        <div style={{height: 30,fontSize: 20,color: 'white'}}>没有相关记录，是否新增?  </div>
        <button
          onClick={this.props.addFunc}
          style={{height: 30,leftmargin: 30,backgroundColor: 'gray'}}>添加</button>
        <div style={{height: 30,fontSize: 20,color: 'white'}}> 关于 "{this.props.searchText}"的记录？</div>
      </div>
    )
  }
}

export default FailInfoView
