const Dialog = props => {
  return (
    <div className="dialog-wrapper">
      <div className="dialog-content">{props.children}</div>
      <style jsx>
        {`
          .dialog-wrapper {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 1000;
          }
          .dialog-content {
            background-color: #fff;
            width: 400px;
            height: 100%;
            overflow: hidden;
            opacity: 1;
            float: right;
            padding: 10px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
              0 6px 6px rgba(0, 0, 0, 0.23);
          }
        `}
      </style>
    </div>
  );
};

export default Dialog;
