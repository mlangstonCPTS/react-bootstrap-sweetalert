'use strict';
import React        from 'react';
import PropTypes    from 'prop-types';
import objectAssign from 'object-assign';
import styles       from '../styles/SweetAlertStyles';

export default class Buttons extends React.Component {

    static propTypes = {
        confirmBtnText     : PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        confirmBtnBsStyle  : PropTypes.oneOf(['default', 'primary', 'link', 'info', 'success', 'warning', 'danger']),
        confirmBtnCssClass : PropTypes.string,
        confirmBtnStyle    : PropTypes.object,
        cancelBtnText      : PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        cancelBtnBsStyle   : PropTypes.oneOf(['default', 'primary', 'link', 'info', 'success', 'warning', 'danger']),
        cancelBtnCssClass  : PropTypes.string,
        cancelBtnStyle     : PropTypes.object,
        btnSize            : PropTypes.string,
        onCancel           : PropTypes.func,
        onConfirm          : PropTypes.func,
        showConfirm        : PropTypes.bool,
        showCancel         : PropTypes.bool,
        focusConfirmBtn    : PropTypes.bool,
    };

    static defaultProps = {
        confirmBtnText     : 'OK',
        confirmBtnBsStyle  : 'primary',
        confirmBtnCssClass : '',
        confirmBtnStyle    : {},
        cancelBtnText      : 'Cancel',
        cancelBtnBsStyle   : 'link',
        cancelBtnCssClass  : '',
        cancelBtnStyle     : {},
        focusConfirmBtn    : true,
        showConfirm        : true,
        showCancel         : false,
        btnSize            : 'lg',
    };

    static styles = {
        primary : {
            borderColor : '#286090',
            shadowColor : 'rgb(165, 202, 234)'
        },
        success : {
            borderColor : '#4cae4c',
            shadowColor : 'rgba(76, 174, 76, 0.6)'
        },
        info : {
            borderColor : '#46b8da',
            shadowColor : 'rgba(70, 184, 218, 0.6)'
        },
        danger : {
            borderColor : '#d43f3a',
            shadowColor : 'rgba(212, 63, 58, 0.6)'
        },
        warning : {
            borderColor : '#eea236',
            shadowColor : 'rgba(238, 162, 54, 0.6)'
        },
        default : {
            borderColor : '#cccccc',
            shadowColor : 'rgba(204, 204, 204, 0.6)'
        }
    };

    buttonStyles = {};

    componentDidMount() {
        this.focusButton();
    }

    componentDidUpdate(prevProps, prevState) {
        // when displaying back to back alerts React will treat this
        // as an update to the same alert. this causes componentDidMount
        // to not be called for the subsequent alerts. i hope to find a better
        // way to handle this in the future, but for now i'm checking if the
        // title, type, or button text has changed
        if (
            prevProps.type !== this.props.type ||
            prevProps.confirmBtnText !== this.props.confirmBtnText ||
            prevProps.title !== this.props.title
        ) {
            setTimeout(() => this.focusButton(), 0);
        }
    }

    focusButton() {
        if (this.props.focusConfirmBtn && this.refs.confirmBtn) {
            try {
                let btn = this.refs.confirmBtn
                setTimeout(() => btn.focus(), 100);
            } catch (e) {
                // whoops
            }
        }
    }

    getButtonStyle = (bsStyle) => {
        if (bsStyle === 'error') bsStyle = 'danger';
        if (this.buttonStyles[bsStyle] == null) {
            const style       = Buttons.styles[bsStyle] || Buttons.styles.default;
            const borderColor = `borderColor: ${style.borderColor} !important`;
            const boxShadow   = `boxShadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px ${style.shadowColor} !important;`;
            this.buttonStyles[bsStyle] = ` ${borderColor} ${boxShadow}`;
        }
        return this.buttonStyles[bsStyle];
    };

    render() {
        if (!this.props.showConfirm && !this.props.showCancel) {
            return false;
        }
        const cancelBtnBsStyle = this.props.cancelBtnBsStyle === 'error' ? 'danger' : this.props.cancelBtnBsStyle;
        const confirmBtnBsStyle = this.props.confirmBtnBsStyle === 'error' ? 'danger' : this.props.confirmBtnBsStyle;
        return (
            <p style={{marginTop: 20}}>
                {this.props.showCancel && (
                    <span>
                        <style type="text/css" scoped>
                            {'button { outline: 0 !important; ' + this.getButtonStyle(cancelBtnBsStyle) + '}'} 
                        </style>
                        <button 
                            style={objectAssign({}, styles.button, this.props.cancelBtnStyle)} 
                            className={`btn btn-${this.props.btnSize} btn-${cancelBtnBsStyle} ${this.props.cancelBtnCssClass}`}
                            onClick={this.props.onCancel}
                            type="button" >
                            {this.props.cancelBtnText}
                        </button>
                    </span>
                )}
                {this.props.showConfirm && (
                    <span>
                        <style type="text/css" scoped>
                            {'button { outline: 0 !important; ' + this.getButtonStyle(confirmBtnBsStyle) + '}'} 
                        </style>
                        <button 
                            ref="confirmBtn"
                            disabled={this.props.disabled}
                            style={objectAssign({}, styles.button, this.props.confirmBtnStyle)} 
                            className={`btn btn-${this.props.btnSize} btn-${confirmBtnBsStyle} ${this.props.confirmBtnCssClass}`}
                            onClick={this.props.onConfirm}
                            type="button" >
                            {this.props.confirmBtnText}
                        </button>
                    </span>
                )}
            </p>
        );
    }
}
