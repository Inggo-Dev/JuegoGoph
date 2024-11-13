import React, { Component } from "react";
import { ConfigProvider, Table, Input } from "antd"
const { Search } = Input;
import locale from 'antd/locale/es_ES';

export default class TablaMaster extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Redirect_Home: false,
            HourGlass: false,
            windowHeight: window.innerHeight,
            screenWidth: window.innerWidth,
            Reportes: [],
            Cols: [],
            filteredDataSource: [],
            dataSource: [],
            current: 1,
            pageSize: 10,
        };
    }

    componentDidMount() {
        this.setState({
            screenWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            dataSource: this.props.datos,
            filteredDataSource: this.props.datos,
            Reportes: this.props.datos,
            Cols: this.props.cols
        })
        window.addEventListener("resize", this.handleResize);
    }

    handleSearch = (value) => {
        const filteredData = value === '' ? this.state.dataSource : this.state.Reportes.filter((record) =>
            Object.values(record).some((fieldValue) =>
                fieldValue.toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        this.setState({ filteredDataSource: filteredData });
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        this.setState({ screenWidth: window.innerWidth });
    };

    handlePaginationChange = (pagination) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.setState({ current: pagination.current, pageSize: pagination.pageSize })
    }

    render() {
        const searchClassName = this.state.screenWidth < 800 ? 'w-100' : 'w-50';
        return (
            <div>
                <ConfigProvider locale={locale}>
                    <Table
                        pagination={{ pageSize: this.state.pageSize, position: ["bottomCenter"], onChange: this.handlePaginationChange, showSizeChanger: true, current: this.state.current, pageSizeOptions: ['10', '20', `${this.state.Reportes.length}`] }}
                        bordered
                        size="small"
                        loading={this.state.HourGlass}
                        columns={this.state.Cols}
                        dataSource={this.state.filteredDataSource.map((item, index) => ({ ...item, key: index }))}
                        onChange={(pagination) => { this.handlePaginationChange(pagination) }}
                        title={() =>
                            <div className="d-flex justify-content-between">
                                <div className="col-6">
                                    {this.props.title}
                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    <Search placeholder="Buscar" onChange={(e) => this.handleSearch(e.target.value)} className={searchClassName} />
                                </div>
                            </div>
                        }
                        scroll={{ x: 'max-content', background: '#f1f1f1', BorderRadios: '6px' }}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'color1-row' : 'color2-row')}
                        className="custom-scroll-table"
                    />
                </ConfigProvider>
                {this.props.footer}
            </div>
        )
    }
}