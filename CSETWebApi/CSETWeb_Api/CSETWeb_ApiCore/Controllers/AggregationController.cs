﻿//////////////////////////////// 
// 
//   Copyright 2024 Battelle Energy Alliance, LLC  
// 
// 
//////////////////////////////// 

using System;
using CSETWebCore.Business.Aggregation;
using CSETWebCore.DataLayer.Model;
using CSETWebCore.Interfaces.Helpers;
using CSETWebCore.Model.Aggregation;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CSETWebCore.Business.Authorization;


namespace CSETWebCore.Api.Controllers
{
    [CsetAuthorize]
    [ApiController]
    [Obsolete("This controller is no longer used")]

    public class AggregationController : ControllerBase
    {
        private readonly ITokenManager _token;
        private readonly CSETContext _context;


        /// <summary>
        /// Constructor
        /// </summary>
        public AggregationController(ITokenManager token, CSETContext context)
        {
            _token = token;
            _context = context;
        }


        /// <summary>
        /// Returns a list of aggregations that the current user is allowed to see.
        /// The user must be authorized to view all assessments involved in the aggregation.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("api/aggregation/getaggregations")]
        public IActionResult GetAggregations([FromQuery] string mode)
        {
            // Get the current userid to set as the Assessment creator and first attached user
            var currentUserId = _token.GetCurrentUserId();

            var manager = new AggregationBusiness(_context, _token);
            return Ok(manager.GetAggregations(mode, (int)currentUserId));
        }


        [HttpPost]
        [Route("api/aggregation/create")]
        public IActionResult CreateAggregation([FromQuery] string mode)
        {
            var manager = new AggregationBusiness(_context, _token);
            return Ok(manager.CreateAggregation(mode));
        }


        [HttpPost]
        [Route("api/aggregation/get")]
        public IActionResult GetAggregation()
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return null;
            }

            var manager = new AggregationBusiness(_context, _token);
            return Ok(manager.GetAggregation((int)aggregationID));
        }


        [HttpPost]
        [Route("api/aggregation/update")] 
        public IActionResult UpdateAggregation([FromBody] Aggregation aggregation)
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return Ok();
            }

            var manager = new AggregationBusiness(_context, _token);
            manager.SaveAggregationInformation(aggregation.AggregationId, aggregation);
            return Ok();
        }


        [HttpPost]
        [Route("api/aggregation/delete")]
        public IActionResult DeleteAggregation([FromQuery] int aggregationId)
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return Ok();
            }
            var manager = new AggregationBusiness(_context, _token);
            manager.DeleteAggregation(aggregationId);
            return Ok();
        }


        [HttpPost]
        [Route("api/aggregation/getassessments")]
        public IActionResult GetAssessmentsForAggregation()
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return Ok();
            }

            var manager = new AggregationBusiness(_context, _token);
            return Ok(manager.GetAssessmentsForAggregation((int)aggregationID));
        }


        [HttpPost]
        [Route("api/aggregation/saveassessmentselection")]
        public IActionResult SaveAssessmentSelection([FromBody] AssessmentSelection request)
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return Ok();
            }

            var aggreg = new AggregationBusiness(_context, _token);
            return Ok(aggreg.SaveAssessmentSelection((int)aggregationID, request.AssessmentId, request.Selected));
        }


        [HttpPost]
        [Route("api/aggregation/saveassessmentalias")]
        public IActionResult SaveAssessmentAlias([FromBody] AliasSaveRequest req)
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return Ok();
            }

            var aggreg = new AggregationBusiness(_context, _token);
            var newAlias = aggreg.SaveAssessmentAlias((int)aggregationID, req.aliasAssessment.AssessmentId, req.aliasAssessment.Alias, req.assessmentList);

            return Ok(newAlias);
        }


        [HttpPost]
        [Route("api/aggregation/missedquestions")]
        public IActionResult GetCommonlyMissedQuestions()
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return Ok(new List<MissedQuestion>());
            }

            var manager = new AggregationBusiness(_context, _token);
            return Ok(manager.GetCommonlyMissedQuestions((int)aggregationID));
        }


        [HttpPost]
        [Route("api/aggregation/maturity/missedquestions")]
        public IActionResult GetCommonlyMissedMaturityQuestions()
        {
            var aggregationID = _token.PayloadInt("aggreg");
            if (aggregationID == null)
            {
                return Ok(new MissedQuestionResponse());
            }

            var manager = new AggregationMaturityBusiness(_context);
            return Ok(manager.GetCommonlyMissedQuestions((int)aggregationID));
        }




        //////////////////////////////////////////
        /// Merge
        //////////////////////////////////////////

        [HttpPost]
        [Route("api/aggregation/getanswers")]
        public IActionResult GetAnswers()
        {
            var aggreg = new AggregationBusiness(_context, _token);
            // return aggreg.GetAnswers(new List<int>() { 4, 5 });

            return Ok();
        }


        /// <summary>
        /// Sets a single answer text into the COMBINED_ANSWER table.
        /// </summary>
        [HttpPost]
        [Route("api/aggregation/setmergeanswer")]
        public IActionResult SetMergeAnswer([FromQuery] int answerId, [FromQuery] string answerText)
        {
            var aggreg = new AggregationBusiness(_context, _token);
            // aggreg.SetMergeAnswer(answerId, answerText);

            return Ok();
        }
    }
}
