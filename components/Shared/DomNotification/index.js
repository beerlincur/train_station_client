import React from 'react'
import ReactDOM from 'react-dom';
import DlNotification from './DlNotification';
import _ from 'lodash';

export const domName = 'dl-notify-000';

const DomNotification = (propOptions = {}, type) => {
  let props = propOptions
  if (typeof propOptions === 'string') {
    props = {
      type: "default",
      title: propOptions,
    }
  }

  const delay = _.toNumber(props.delay) || 0

  setTimeout(() => {
    makeNotification()
  }, delay);

  const makeNotification = () => {
    // todo use portal
    const rootEl = document.createElement('div');
    document.body.appendChild(rootEl);

    const notifications = document.querySelectorAll(`div[data-name=${domName}]`);

    const lastInstance = notifications[notifications.length - 1];

    if (!props.bottom) {
      props.bottom = 0
    }
    if (props.duration !== 0) {
      props.duration = props.duration || 4000
    }
    if (!props.type) {
      props.type = "default"
    }
    if (type) {
      props.type = type
    }

    props.bottom = (lastInstance ? (parseInt(lastInstance.style.bottom, 10) + lastInstance.offsetHeight) : props.bottom) + 16;
    props.id = lastInstance ? +(lastInstance.id) + 1 : 1


    const element = React.createElement(DlNotification, {
      ...props,
      close: (height, bottom, itemId) => {
        if (rootEl && document.body.contains(rootEl))
          setTimeout(() => document.body.removeChild(rootEl));
        if (typeof props.onClose === "function") props.onClose.call()
        const notifications = document.querySelectorAll(`div[data-name=${domName}]`);
        const len = notifications.length;
        requestAnimationFrame(() => {
          for (let i = 0; i < len; i++) {
            const element = notifications[i];
            if (+element.id !== itemId) {
              const elementBottom = parseInt(element.style.bottom, 10);
              if (elementBottom > bottom) {
                element.style.bottom = `${elementBottom - height - 16}px`;
              }
            }
          }
        })
      },
    })

    ReactDOM.render(element, rootEl);
  }
}

['success', 'warning', 'info'].forEach(type => {
  DomNotification[type] = (options = {}) => DomNotification(options, type);
});

DomNotification.error = (options = {}) => DomNotification(options, 'error')

export default DomNotification;
