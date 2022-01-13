import React from 'react';
const AndOrBtn = (props) => {
  return (
    <div style={{ display: 'flex' }}>
      <section class="action-button">
        <hr />
        <div class="and-button" onClick={() => props.handle()}>
          <span>+</span>
          {props.text}
        </div>
        <hr />
      </section>
    </div>
  );
};

export default AndOrBtn;
