import React, {Component} from 'react';
import Button  from 'antd/lib/button';
import Icon from '../../components/icon'
import logo from '../../logo.png';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {fetchCount} from '../../modules/count'

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {countChanged: false};
    }

    componentDidMount() {
        const {fetchCount} = this.props;

        fetchCount();

        const intervalId = setInterval(() => {
            fetchCount();
        }, 3000);

        this.setState({intervalId: intervalId});
    }

    componentDidUpdate(prevProps) {
        const {count: oldCount} = prevProps;
        const {count} = this.props;

        if (count !== oldCount) {
            this.setState({countChanged: true});

            setTimeout(() => {
                this.setState({countChanged: false});
            }, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    render() {
        const {count} = this.props;
        const {countChanged} = this.state;

        return (
            <div className="home-page">
                <div className="index-page-content">
                    <div className="logo">
                        <img src={logo} alt="eSteem Search"/>
                    </div>
                    <div className="brand">
                        <span>eSteem</span> Search
                    </div>
                    <div className="search-area">
                        <div className="add-on">
                            <Icon icon="search"/>
                        </div>
                        <input type="text" id="txt-search" maxLength={100} onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                this.submit()
                            }
                        }} placeholder="How to become a millionaire with Steem"/>
                    </div>
                    <div className="form-submit">
                        <Button size="large" type="primary" onClick={e => this.submit()}>Search</Button>
                    </div>

                    <div className={`indexed-count ${count ? 'visible' : ''} ${countChanged ? 'changed' : ''}`}>
                        <span>{count.toLocaleString()}</span> documents indexed
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({count}) => ({
    count: count.val
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchCount
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)