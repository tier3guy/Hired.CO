import React from 'react';
import './CSS/alert.css';

const alertCopy = () => {
  return (
    <div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content p-3 alert-link">
          Link Copied
        </div>
      </div>
    </div>
  )
}

export default alertCopy