import React from 'react'

const About = () => {
  return (
    <div class="modal fade" id="about-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header w-100">
            <h2 class="modal-title font-orange text-center font-main" id="exampleModalLabel">About Hired.CO</h2>
          </div>
          <div class="modal-body">

            <p className="font-main font-blue">
            Hired.CO is an online platform for both interviewers and interviewees for there smooth interviews process. The platform is build on a hackthon Technex'22 under open invocation's track. The team was Syntax Error who had build this platform. The flatform includes an in-built draw board and messaging center. We are also looking for upper versions of this platform in each we are also targeting to give a in-built code editor and screen sharing experience. 
            </p>

            <p className="font-main font-blue">
            Also we would love to give thank to Technex team for having this wonderful hackthon and because of them the website is live now.
            </p>

            <p className="font-main font-orange">
            ~ ❤️ from Team Lead Avinash Gupta <a href="">(LinkedIn)</a>
            </p>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-primary w-100 font-main">Nice!</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About