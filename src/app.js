import React,{ Component } from 'react';
// 导入组建
import ResultInfo from './resultInfo'
import FailInfoView from './failInfoView'

var NebPay = require("./dist/nebpay");
var nebPay = new NebPay();

console.log(nebPay)

var Nebulas = require('nebulas')
var Neb = Nebulas.Neb; // Neb
var neb = new Neb(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
var Account = Nebulas.Account;
var api = neb.api;
const dappAddress = "n1srytXK8sWZXWzqg9TCZLh8hBYuhZhXyRk"  //my contract hash


// App 默认的有两个属性

// 第一个：props {}
// this.state
class App extends  Component{
  // 构造函数
  constructor(props) {
    super(props)
    // state里面的内容属于私有，只有内部能够访问
    // 状态机变量
    // 一旦状态机变量的值一旦发生变化，就会重新调用render函数渲染UI
    this.state = {
      isResult: false,
      resultObj: {},
      isSearchFail: false,
      isShowInputView: false
    }
  }

  cbPush = (resp) => {
      console.log("response of push: " + JSON.stringify(resp))
      var intervalQuery = setInterval(() => {
        api.getTransactionReceipt({hash: resp["txhash"]}).then((receipt) => {
            console.log("判断数据提交到区块链的状态")
            // console.log(receipt)
            if (receipt["status"] === 2) {
                console.log("pending.....")
            } else if (receipt["status"] === 1){
                console.log("交易成功......")
                //清除定时器
                clearInterval(intervalQuery)
            }else {
                console.log("交易失败......")
                //清除定时器
                clearInterval(intervalQuery)
            }
        });
      }, 5000);

  }

  // 渲染
  render() {
    return (
        <div style={{backgroundColor: "rgb(52,83,112)",flex: 1,display: "flex",flexDirection: 'column',alignItems: 'center'}}>
        <div style={{width: "100%",marginTop: 5,marginLeft: 20,display: "flex",justifyContent: 'left'}}>
            <img src="images/logo.png" style={{marginTop: 20,width: 200,height: 157,marginRight: 50}}></img>
          </div>

          <div style={{}}>
            <div style={{fontFamily: '"Arial","Microsoft YaHei","黑体","宋体",sans-serif',fontSize: 48}}>区块链备忘录</div>
          </div>
          <div style={{width: "100%",height: 50,marginTop: 50,display: "flex",justifyContent: 'center'}}>
              <input
                ref="inputRef"
                style={{borderWidth: 3,borderColor: "gray",fontSize: 34,flex: 1,marginLeft: 100}}/>
              <button 
                onClick={() => {
                  console.log("搜索")
                  console.log(this.refs.inputRef.value)
                  this.setState({isShowInputView: false})
                  var from = "n1YLc2ndCuzS5hKthxvpBDtv1c1YPa6Pacw"
                  var value = "0";
                  var nonce = "0"
                  var gas_price = "1000000"
                  var gas_limit = "2000000"
                  var callFunction = "get";
                  var callArgs = "[\"" + this.refs.inputRef.value + "\"]"; //in the form of ["args"]
                  var contract = {
                      "function": callFunction,
                      "args": callArgs
                  }
                     console.log("contract",contract)
                  neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then( (resp) => {

                      console.log("数据查询完成\n")
                      console.log(resp)
                      console.log(resp["result"])
                      if (resp["result"] !== "null") {
                          console.log("========================")
                          //修改状态机变量的值
                          // 如何修改状态机变量的值
                          // this.state.isResult = true
                          // 正确的姿势
                          this.setState({isResult: true})
                          // "Error: empty key"
                          var obj = {}
                          if (resp["result"] == "Error: empty key") {
                            obj["key"] = ""
                            obj["value"] = resp["result"]
                            obj["author"] = ""
                          } else {
                            obj = JSON.parse(resp["result"])
                          }
                          this.setState({resultObj: obj,isSearchFail: false})
                      } else {
                          console.log("-------------------------")
                          this.setState({isResult: false,isSearchFail: true})
                      }
                  }).catch(function (err) {

                      console.log("error:" + err.message)
                  })
                }}
                style={{width: 200,marginLeft: 40,background: "gray",fontSize: 34,marginRight: 100}} >检索</button>
          </div>
          {
            this.state.isShowInputView ?
            <div style={{width: "100%",display: 'flex',height: 500,marginTop: 50}}>
              <textarea
                ref="inputValueRef"
                style={{borderWidth: 3,borderColor: "gray",fontSize: 34,flex: 1,marginLeft: 100}}/>
              <button 
                onClick={() => {
                  console.log("调用合约的save方法!")
                  var value = "0";
                  var callFunction = "save";
                  var dtm = new Date().toLocaleString(); 
                  var callArgs = "[\"" +this.refs.inputRef.value + "\",\""  + "记录时间:"+dtm+"::::"+this.refs.inputValueRef.value.replace(/\n/g,", ") + "\"]"
                  console.log(callArgs)
                  nebPay.call(dappAddress, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                      listener: this.cbPush        //设置listener, 处理交易返回信息
                  });

                }}
                style={{width: 200,marginLeft: 40,fontSize: 34,background: "gray",marginRight: 100}} >保存</button>
            </div>:
            <div style={{display: "flex",width: "100%",justifyContent: 'center'}}>
              {
                this.state.isResult ?
                  <ResultInfo
                    keyInfo={this.state.resultObj["key"]}
                    valueInfo={this.state.resultObj["value"]}
                    accountInfo={this.state.resultObj["author"]}
                  />
                :
                <div>
                  {
                    this.state.isSearchFail?
                    <FailInfoView
                      addFunc={() => {
                        console.log("app.js FailInfoView")
                        this.setState({isShowInputView: true})
                      }}
                      searchText={this.refs.inputRef.value}/>
                    :
                    <div />
                  }
                </div>
              }
            </div>
          }


        </div>
    )
  }
}

export default App;
