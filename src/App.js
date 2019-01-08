import React, { Component } from 'react';
import './App.css';
import './reset.css';
import * as artifact from './contracts/Predict'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import PieReact from './echarts'

import 'antd/dist/antd.css'
import { Modal, Button, Layout, Input, InputNumber, Switch, Icon, message, Radio, DatePicker, Popconfirm } from 'antd'
const {
    Header, Footer, Sider, Content,
} = Layout
const { TextArea } = Input;
const RadioGroup = Radio.Group;


const setItem = function (name, value) {
    if (!window.localStorage || !name || !value) return false;
    window.localStorage.setItem(name, JSON.stringify(value));
}
const getItem = function (name) {
    if (!window.localStorage || !name) return false;
    return JSON.parse(window.localStorage.getItem(name));
}

class App extends Component {

    constructor(props) {
        super(props);

        window.tronWeb.setDefaultBlock('latest');

        this.contract = null;
        this.state = {
            address: null,
            balance: null,
            contract: null,
            tokenBalance: null,
            result_0: null,
            result_1: null,
            result_2: null,
            getAllpacket: [],
            currentPacket: {},
            infoModal: true,
            info_name: '',
            info_sex: 1,
            info_luckynum: 0,
            info_birth: null,
            checkUser: false,
            donate: 5,
            donateModal: false,
            help: 1,
            helpModal: false,
            typeid: 1,
            getUserlove: -1,
            getUsercareer: -1,
            getUsermoney: -1,
        }
    }

    async componentDidMount() {

        let tronWeb = window.tronWeb;
        console.log('address', tronWeb.defaultAddress.base58)
        this.setState({ address: tronWeb.defaultAddress.base58 });
        let address = tronWeb.address.fromHex(artifact.networks['*'].address);
        console.log(artifact.abi, artifact.networks['*'].address, address)
        this.contract = tronWeb.contract(artifact.abi, address);
        console.log(this.contract);

        let userStatus = await this.checkUser()
        this.setState({
            checkUser: userStatus,
        })
        this.getUser();


        // let contractInstance = await window.tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        // //监听 predictSuccess 事件
        // contractInstance["predictSuccess"]().watch(function (err, res) {
        //     console.log(res,'resresresresresresresres');
        //     //监听结果，为预测的分数
        //     score = res["result"]["score"];
        //     if(this.state.predictType == 1) {
        //         this.setState({
        //             getUserlove: 11,
        //         })
        //     } else if(this.state.predictType == 2) {
        //         this.setState({
        //             getUsercareer: 22,
        //         })
        //     } else if(this.state.predictType == 3) {
        //         this.setState({
        //             getUsermoney: 33,
        //         })
        //     }
        // });
    }


    ///简介
    ///这个项目主要功能  算命～～～～～，分为爱情，事业，财富

    ///1.checkUser,用来检查用户是否以前算过，算过的话，链上有用户数据，就不需要重新输入数据
    ///            没有算过的话，就需要输入个人信息
    ///每次只能选一个算，爱情事业财富，三选一
    ///如果之前算过爱情的，再算爱情的，结果不会改变
    ///想要改变结果需要通过转运功能

    ////用户可以做的事情  1. 爱情，事业，财富   算命
    ////               2. 爱情，事业，财富   转运
    ////               3. 打赏开发者


    //checkUser检查是否有用户数据（返回true 或者 false）
    //typeid 预测的类型（1 -- 爱情， 2 -- 事业， 3 -- 财运）
    //true --- 有数据 ，调用 predict (只需要传入一个参数，typeid)
    //false -- 没有数据，调用 predictFirst （除了typeid， 还有个人信息）
    checkUser = async () => {
        let userInfo = getItem('userInfo')
        if (userInfo && userInfo.name) return true
        let result_0 = await this.contract.checkUser().call()
        return JSON.parse(result_0)
    };

    //我的记录
    //获取用户数据
    /*
    struct User {
        uint256 userid;             //用户id
        string name;                //姓名
        uint256 sex;                //性别 0--女， 1--- 男
        uint256 birthday;           // 19990110
        uint256 luckynumber;        //6666
        uint256 type_love;          //99    -- 用分数和类型去大苏那里去文字
        uint256 type_career;        //66
        uint256 type_money;         //88
    }
    */
    getUser = async () => {
        let result_0 = await this.contract.getUser().call()
        this.setState({ getUsername: result_0[1] })
        this.setState({ getUsersex: JSON.parse(result_0[2]) })
        this.setState({ getUserbirthday: JSON.parse(result_0[3]) })
        this.setState({ getUserluckynumber: JSON.parse(result_0[4]) })
        this.setState({ getUserlove: JSON.parse(result_0[5]) })
        this.setState({ getUsercareer: JSON.parse(result_0[6]) })
        this.setState({ getUsermoney: JSON.parse(result_0[7]) })

        setItem('userInfo', {
            name: result_0[1],
            sex: JSON.parse(result_0[2]),
            birthday: JSON.parse(result_0[3]),
            luckynumber: JSON.parse(result_0[4]),
        })
    };


    //运势
    predict = async (typeid) => {
        this.setState({
            predictType: typeid,
        })
        //监听
        //41dbeba2b4d7e5ce37f84e6b949681316c8259a159 为合约地址，部署新合约后，需替换
        let score;
        let contractInstance = await window.tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        //调用 合约中得predict
        let typepredict = typeid ///1是love，2是career，3是money
        let result_0 = await this.contract.predict(typepredict).call()
        score = result_0.toNumber()

        console.log("---------------------")
        console.log(typeid, score)
        if (typeid == 1) {
            this.setState({
                getUserlove: score,
            })
        } else if (typeid == 2) {
            this.setState({
                getUsercareer: score,
            })
        } else if (typeid == 3) {
            this.setState({
                getUsermoney: score,
            })
        }
        if (score == 0) {
            let result_0 = await this.contract.predictType(typepredict).send({
                feeLimit: 100000000,
                callValue: 0,
                shouldPollResponse: true
            })
            console.log(result_0)
        }
        // this.getUser()
        //this.setState({ predict: score })
    };

    //第一次算运势
    predictFirst = async () => {
        console.log("predictFirst")
        if (!this.state.info_name || !this.state.info_birth || !(this.state.info_luckynum || this.state.info_luckynum == 0)) {
            message.error('请填写完整!');
            return
        }
        let name = this.state.info_name;
        let sex = this.state.info_sex;
        let birthday = +this.state.info_birth;
        let luckynumber = this.state.info_luckynum;
        let typepredict = this.state.typeid;
        console.log(name, sex, birthday, luckynumber)
        setItem('userInfo', {
            name,
            sex,
            birthday,
            luckynumber,
        })
        //监听
        // let score;
        // console.log("---------------------")
        // let contractInstance = await window.tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        // console.log(contractInstance)
        // contractInstance["predictSuccess"]().watch(function (err, res) {
        //     console.log("error " + err);
        //     console.log('eventResult:', res);
        //     console.log("---------------------")
        //     console.log('score:', res["result"]["score"]);
        //     score = res["result"]["score"];
        // });
        //调用 合约中得predictFirst
        //string _name, uint256 _sex, uint256 _birthday, uint256 _luckynumber, uint256 _type
        //let name = "hahaha"
        //let sex = 1
        //let birthday = 19970101
        //let luckynumber = 6
        //let typepredict = 2 ///1是love，2是career，3是money
        try {

            let result_0 = await this.contract.predictFirst(name, sex, birthday, luckynumber, typepredict).send({
                feeLimit: 100000000,
                callValue: 0,
                shouldPollResponse: true
            })
            console.log(result_0, '<<<<<<<<')
        } catch(e) {
            console.log(e.toString())
        }
        this.hideInfoModal()
        this.getUser()
        //this.setState({ predictFirst: score })
    };

    //捐赠给开发者
    donate = async () => {
        //监听
        console.log("---------------------")
        let contractInstance = await window.tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        console.log(contractInstance)
        contractInstance["DonateSuccess"]().watch(function (err, res) {
            console.log("error " + err);
            console.log('eventResult:', res);
            console.log("---------------------")
            console.log('Money:', res["result"]["money"]);
        });
        console.log("---------------------")
        let tron = 1000000
        let money = this.state.donate
        let result_0 = await this.contract.donate(money).send({
            feeLimit: 100000000,
            callValue: money * tron,
            shouldPollResponse: true
        })
        console.log(result_0)
        //this.setState({ donate: res["result"]["money"] })
    };

    //转运
    help = async () => {
        //监听
        let score;
        console.log("---------------------")
        let contractInstance = await window.tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        console.log(contractInstance)
        contractInstance["predictSuccess"]().watch(function (err, res) {
            console.log("error " + err);
            console.log('eventResult:', res);
            console.log("---------------------")
            console.log('score:', res["result"]["score"]);
            score = res["result"]["score"]
        });
        console.log("---------------------")
        let typeid = this.state.help
        let result_0 = await this.contract.help(typeid).send({
            feeLimit: 100000000,
            callValue: 5000000,      //手续费，转运付费，5tron
            shouldPollResponse: true
        })
        this.hideHelpModal()
        this.getUser();
    };

    //不做锦鲤榜的话，下面的getLove，getCareer，getMoney就不用了
    //爱情运势记录，typeid = 1
    //用来坐排行榜
    getLove = async () => {
        let result_0 = await this.contract.getLovekey().call()
        let users = [];
        let user;
        console.log("----------------")
        console.log(result_0)
        console.log("----------------")
        for (let i = 1; i < JSON.parse(result_0); i++) {
            console.log(i)
            user = console.log(await this.contract.getLove(i).call())
            //返回这预测的用户
            //用用户地址去取他的分数，
            users.push(user)
        }
        this.setState({ getLove: users.join(",") })
    }

    //事业运势记录，typeid = 2
    getCareer = async () => {
        let result_0 = await this.contract.getCareerkey().call()
        let users = [];
        let user;
        console.log("----------------")
        console.log(result_0)
        console.log("----------------")
        for (let i = 1; i < result_0; i++) {
            console.log(i)
            console.log(await this.contract.getCareer(i).call())
            users.push(user)
        }
        this.setState({ getCareer: users.join(",") })
    }

    //财富运势记录，typeid = 3
    getMoney = async () => {
        let result_0 = await this.contract.getMoneykey().call()
        let users = [];
        let user;
        console.log("----------------")
        console.log(result_0)
        console.log("----------------")
        console.log(result_0)
        for (let i = 1; i < result_0; i++) {
            console.log(i)
            console.log(await this.contract.getMoney(i).call())
            users.push(user)
        }
        this.setState({ getMoney: users.join(",") })
    }

    hideInfoModal = async () => {
        this.setState({
            infoModal: false,
        })
    }
    hideDonateModal = async () => {
        this.setState({
            donateModal: false,
        })
    }
    hideHelpModal = async () => {
        this.setState({
            helpModal: false,
        })
    }
    handleInfoname = async (e) => {
        let value = e.target.value
        this.setState({
            info_name: value,
        })
    }
    handleInfoBirth = async (date) => {
        this.setState({
            info_birth: date,
        })
        console.log(date)
    }

    handleInfoSex = async (e) => {
        let value = e.target.value
        this.setState({
            info_sex: value,
        })
    }
    handleHelp = async (e) => {
        let value = e.target.value
        this.setState({
            help: value,
        })
    }
    handleInfoluckynum = async (value) => {
        this.setState({
            info_luckynum: value,
        })
    }
    handleDonate = async (value) => {
        this.setState({
            donate: value,
        })
    }

    showInfo = async (value) => {
        this.setState({
            infoModal: true,
            typeid: value,
        })
    }
    showDonate = async () => {
        this.setState({
            donateModal: true,
        })
    }
    showHelp = async () => {
        this.setState({
            helpModal: true,
        })
    }

    predictCancel = async () => {
    }



    render() {
        return (
            <div className="App">
                <div className='top'>
                    <div className='logo'>TRON LUCK</div>
                    <p className='address'>{this.state.address}</p>
                </div>
                <Layout className='layout' id='gradient'>
                    <Sider width='360' className='App-sider border-box container'>
                        <p className='title'>测运势</p>
                        {!this.state.checkUser ?
                            <ul className='info-list'>
                                <li>
                                    <div className='send-box money'>
                                        <div className='send-img' onClick={this.showInfo.bind(this, 3)}>
                                        </div>
                                        <p>财富运势</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='send-box shiye'>
                                        <div className='send-img' onClick={this.showInfo.bind(this, 2)}>
                                        </div>
                                        <p>事业运势</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='send-box love'>
                                        <div className='send-img' onClick={this.showInfo.bind(this, 1)}>
                                        </div>
                                        <p>爱情运势</p>
                                    </div>
                                </li>
                            </ul>
                            :
                            <ul className='info-list'>
                                <li>
                                    <div className='send-box money'>
                                        <div className='send-img' onClick={this.predict.bind(this, 3)}>
                                        </div>
                                        <p>财富运势</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='send-box shiye'>
                                        <div className='send-img' onClick={this.predict.bind(this, 2)}>
                                        </div>
                                        <p>事业运势</p>
                                    </div>
                                </li>
                                <li>
                                    <div className='send-box love'>
                                        <div className='send-img' onClick={this.predict.bind(this, 1)}>
                                        </div>
                                        <p>爱情运势</p>
                                    </div>
                                </li>
                            </ul>
                        }
                        <div className='bottom-btn'>
                            <p onClick={this.showHelp}>转运</p>
                            <p onClick={this.showDonate}>捐赠</p>
                        </div>

                    </Sider>
                    <Content className='App-content border-box container'>
                        {/* <div>
                            <p>name:{this.state.getUsername}</p>
                            <p>sex:{this.state.getUsersex}</p>
                            <p>birthday:{this.state.getUserbirthday}</p>
                            <p>luckynumber:{this.state.getUserluckynumber}</p>
                            <p>love:{this.state.getUserlove}</p>
                            <p>career:{this.state.getUsercareer}</p>
                            <p>money:{this.state.getUsermoney}</p>
                            <hr></hr>
                        </div> */}
                        <PieReact data={this.state}></PieReact>
                        {/* <PieReact data={{
                            getUserlove: -1,
                            getUsercareer: -1,
                            getUsermoney: -1,
                        }}></PieReact> */}
                    </Content>
                </Layout>
                <Footer className='App-footer border-box container'>
                    <p>All rights reserved.</p>
                    <p>© Copyright 2018  renwuming.com</p>
                    <p>Powered by chain-team</p>
                </Footer>

                <Modal
                    visible={this.state.helpModal}
                    onCancel={this.hideHelpModal}
                    footer={null}
                    className='send-modal help-modal'
                >
                    <div className='step2-box'>
                        <RadioGroup onChange={this.handleHelp} value={this.state.help}>
                            <Radio value={1}>爱情</Radio>
                            <Radio value={2}>事业</Radio>
                            <Radio value={3}>财富</Radio>
                        </RadioGroup>
                        <p className='send-btn' onClick={this.help}>提交</p>
                    </div>
                </Modal>

                <Modal
                    visible={this.state.donateModal}
                    onCancel={this.hideDonateModal}
                    footer={null}
                    className='send-modal donate-modal'
                >
                    <div className='step2-box'>
                        <InputNumber
                            placeholder='捐赠数额'
                            min={10}
                            max={9999}
                            value={this.state.donate} onChange={this.handleDonate}
                        ></InputNumber>
                        <p className='send-btn' onClick={this.donate}>提交</p>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.infoModal}
                    onCancel={this.hideInfoModal}
                    footer={null}
                    className='send-modal'
                >
                    <div className='step2-box'>
                        <Input placeholder='姓名'
                            value={this.state.info_name} onChange={this.handleInfoname}
                        ></Input>
                        <RadioGroup onChange={this.handleInfoSex} value={this.state.info_sex}>
                            <Radio value={1}>男</Radio>
                            <Radio value={0}>女</Radio>
                        </RadioGroup>
                        <DatePicker
                            locale={locale}
                            onChange={this.handleInfoBirth}
                            value={this.state.info_birth}
                            placeholder='请选择生日'></DatePicker>
                        <InputNumber
                            placeholder='幸运数字'
                            min={0}
                            max={999}
                            value={this.state.info_luckynum} onChange={this.handleInfoluckynum}
                        ></InputNumber>
                        <Popconfirm title="提交个人信息后将不可更改，确定提交？" onConfirm={this.predictFirst} onCancel={this.predictCancel} okText="确定" cancelText="取消">
                            <p className='send-btn'>提交</p>
                        </Popconfirm>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default App;
