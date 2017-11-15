import React from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {grey100} from 'material-ui/styles/colors';
import moment from 'moment';
import {TextField} from 'redux-form-material-ui';

import {currencyFormat} from '../../utils/style-utils';

const SignForm = props => {
  const {loanOffer, profile} = props;
  const wrapperStyles = {width: '95%', margin: '0 auto', marginBottom: '1em'};
  const paperStyles = {
    padding: '25px',
    fontSize: '13px',
    textAlign: 'justify',
    textJustify: 'inter-word'
  };
  return (
    <div style={wrapperStyles}>
      <form>
        <Paper style={paperStyles}>
          <div style={{textAlign: 'center'}}>
            <h1>Loan Agreement and Promisory Note</h1>
          </div>
          <div style={{textAlign: 'right'}}>
            <span>{`${profile.first_name} ${profile.last_name}`}</span><br />
            <span>{`${profile.current_address.street_one} ${profile.current_address.street_two}`}</span><br />
            <span>{`${profile.current_address.city}, ${profile.current_address.state_id} ${profile.current_address.zip_code}`}</span><br />
            <span>{`$${currencyFormat(loanOffer.principal_amount)}`}</span><br />
          </div>
          <div>
            <h5>Poplar Finance Inc.</h5>
            <span>{moment().format('MM/DD/YYYY')} (the "Loan Commencement Date")</span>
            <h6>Loan Agreement and Promissory Note</h6>

            <span>The terms and conditions of this Loan Agreement and Promissory Note (this “Agreement”) are a binding contract between Poplar Finance, Inc., a Delaware corporation (“Poplar Finance,” “Lender,” “we,” “us,” or “our”), and the borrower (“Borrower,” “you” and “your”, which for purposes of this Agreement includes all parties obligated hereunder, including any joint applicant/co-borrower), whose name(s) and address(s) are listed above. The terms of this Agreement affect your rights and you should read them carefully and print a copy for your records. Your agreement to these terms means you agree to borrow and repay the money if your loan is approved under the terms of this Agreement, and agree to have any dispute with us resolved by binding arbitration.</span><br /> <br /> 

            <span>Reference is made to that certain [___________________ (describe Lease Agreement), dated as of [       ], by and between [lessee] (the “Lessee”) and [landlord] (the “Landlord”) pursuant to which Lessee shall lease and inhabit the real property having the address: ____________________________(the “Leased Premises”). ]</span><br />
           
            <h5>1. Loan Terms</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>The principal amount of your loan is: ${currencyFormat(loanOffer.principal_amount)}</span><br />
              <span>The origination fee for your loan is: $0</span><br />
              <span>The amount given to you directly for the Purpose (as defined below) is: $0</span><br />
              <span>The annual loan interest rate is: {loanOffer.interest_rate/100}%</span><br /><br />

              <span>For value received, you promise to pay to the order of Poplar Finance or any subsequent holder of this Agreement the principal sum of {currencyFormat(loanOffer.principal_amount)} Dollars with interest as set forth below. You intend to be legally bound by this Agreement and the Promissory Note (the “Note”) contained in this Agreement. You have read, understood, and agreed to all of the terms of this Agreement and the Note contained in this Agreement.</span><br /><br />

              <span><span style={{textDecoration: 'underline'}}>Interest Rate.</span> The Note bears interest during each calendar month from the date hereof until paid in full, at a fixed rate of {loanOffer.interest_rate/100}% per annum.</span><br /><br />

              <span><span style={{textDecoration: 'underline'}}>Interest Calculation Method.</span>Interest is calculated daily on the basis of a 360-day year with 12 months each of which is 30 days (or 30/360) long, regardless of whether a month has more or fewer than 30 days. The Note shall bear interest on any overdue installment of principal and, to the extent permitted by applicable law, on any overdue installment of interest, at the interest rate stated and as calculated above.</span><br /><br />

              <span><span style={{textDecoration: 'underline'}}>Payments During Interest Only Period.</span>Interest only is to be paid during and throughout the period beginning on the Loan Commencement Date and ending immediately prior to the Amortization Commencement Date (the “Interest Only Period”) in the following manner:</span><br /><br />
              <div style={{paddingLeft: '20px'}}>
                <span>Payments of interest in the amount of [________________ ($______)] Dollars are to be made by you to Poplar Finance commencing [_____________, 20_], and on the same day of each successive month thereafter until [__________, 20__], when the Amortization Period (as defined below) begins, and you will be obligated to make payments as described below in the paragraph entitled “Payments During Amortization Period”.</span> 
              </div>
              <br /><br />

              <span><span style={{textDecoration: 'underline'}}>Amortization Commencement Date.</span>As used in this Agreement, the term “Amortization Commencement Date” shall mean the date the Lessee’s tenancy or occupancy of the Leased Premises ends or is terminated for any reason.</span><br /><br />

              <span><span style={{textDecoration: 'underline'}}>Payments During Amortization Period.</span>Principal and interest is to be paid during and throughout the period beginning on the Amortization Commencement Date and ending [________] months following the Amortization Commencement Date (the “Amortization Period”) in the following manner:</span><br /><br /> 

              <div style={{paddingLeft: '20px'}}>
                <span>Payments of principal and interest in the amount of ________________ ($______) Dollars are to be made by you to Poplar Finance commencing on the date that is one (1) month following the Amortization Commencement Date, and on the same day of each successive month thereafter until the [first (1st)] anniversary of the Amortization Commencement Date, when the full amount of unpaid principal, together with unpaid accrued interest is due and payable.</span> 
              </div>
              <br /><br />

              <span>All payments on the Note are to be made in immediately available lawful money of the United States.</span><br />
            </div>
              
            <h5>2. Credit Reports</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You hereby authorize us (and our service providers) to obtain consumer reports (also called credit reports) and related information about you from one or more consumer reporting agencies. We may also obtain additional consumer reports at any time in connection with the origination, servicing, administration, collection, or enforcement of the loan.</span><br />
            </div>

            <h5>3. Verification of Information</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>We may verify any information you submit by requiring you to produce appropriate documentation or other proof, and also reserve the right to conduct such verification through any third parties. You hereby authorize us to request and obtain data from any third parties to verify any information you provide to us in connection with your application. Verification of information may cause a delay in the disbursement of loan proceeds. We may terminate consideration of your application at any time in our sole discretion.</span><br />
            </div>

            <h5>4. Loan Funding and Closing</h5>
            <div>
              <ul>
                <li>Funding. You authorize us to disburse the loan proceeds by Automated Clearing House (“ACH”) transfer to the Landlord or, at our sole discretion, by check made payable to the Landlord, unless otherwise agreed in writing between you and us. We will disburse the loan proceeds promptly following the completion and approval of your loan application and the signing of this Agreement.</li>
                <li>Closing. BY ELECTRONICALLY SIGNING OR AGREEING TO THIS AGREEMENT IN ANOTHER WAY, YOU ARE COMMITTING TO OBTAIN A LOAN FROM US IN THE AMOUNT AND ON THE TERMS SET FORTH IN THIS AGREEMENT. YOU HAVE NO RIGHT TO RESCIND THE LOAN ONCE MADE BUT YOU MAY PREPAY THE LOAN AT ANY TIME WITHOUT PENALTY. WE HAVE NOT AGREED TO MAKE A LOAN TO YOU UNLESS AND UNTIL WE INFORM YOU THAT WE HAVE APPROVED YOUR LOAN APPLICATION.</li>
                <li>Closing by Telephone: IF YOU AGREE TO THE TERMS OF THE LOAN BY TELEPHONE, WE WILL DISBURSE THE LOAN PROCEEDS IN ACCORDANCE WITH THE TERMS OF THIS PARAGRAPH 4.  THIS AGREEMENT CONTAINS A TRUTH IN LENDING DISCLOSURE STATEMENT THAT CONFIRMS SUCH TERMS.</li>
              </ul>
            </div>

            <h5>5. Promise to Pay</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You promise to pay to us the amount of your loan set forth in Loan Terms, above, together with interest and fees as provided in this Agreement.</span><br />
            </div>

            <h5>6. Interest</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You agree to pay interest on the unpaid principal balance of the amount of your loan from the date the loan proceeds are disbursed until the loan is paid in full, at the fixed annual loan interest rate set forth in Loan Terms above.</span><br />
            </div>

            <h5>7. Payment Dates</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You agree to make monthly payments of interest during the Interest Only Period and of principal and interest during the Amortization Period, in each case in the amounts and on the dates described in the payment schedule in Loan Terms above. Your payment date is the same date each month, except that if your payment date is on the 29th, 30th, or 31st of a month, then your payment date will be the last day of any month that does not have a 29th, 30th, or 31st day (as applicable). The last payment may be a different amount because of rounding and because of when you made your prior payments and whether you paid them in full.</span><br />
            </div>

            <h5>8. Making Your Loan Payments</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You may receive a monthly statement advising you of the monthly loan payment due in connection with your loan, which statement may be delivered to you electronically.  You may make loan payments by ACH transfer. If you authorize us and our successors and assigns (and any of our successors’ and assignees’ affiliates, agents or service providers), we will debit your designated account by ACH transfer for the amount of the payment due on its due date as provided in a separate voluntary ACH authorization form.</span><br />
            </div>

            <h5>9. Prepayments and Partial Payments</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You may make any payment early, in whole or in part, without penalty or premium at any time. Any partial prepayment is to be applied against the principal amount outstanding and does not postpone the due date of any subsequent monthly installment payments, unless we otherwise agree in writing. If you prepay the principal amount in part, you agree to continue to make regularly scheduled payments until all amounts due under this Agreement are paid. We may accept late payments or partial payments, even though marked “paid in full” or with similar language, without losing any rights under this Agreement. We will use any payment we receive to pay any payment then due, in whole or in part; if no payment is then due, we will use any payment of the regularly scheduled payment amount to pay the next scheduled payment. If the next scheduled payment has been paid, or if the payment is in another amount, we will treat the payment as a partial prepayment, unless you and we agree otherwise. If at any time we receive directly from the Landlord any full or partial repayment of your deposit or related security or deposit obligation incurred in connection with your tenancy or occupancy of the Leased Premises, we will treat such repayment as a full or partial prepayment of your loan in accordance with the terms of this Section.</span><br />
            </div>

            <h5>10. Application of Payments</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>All payments shall be credited first to charges, fees, costs, and expenses payable by you under the loan or in connection with the obligations evidenced by the loan, second to accrued interest then due, thereafter to unpaid principal; provided, however, that after an Event of Default (as defined below), payments will be applied to your obligations as we determine in our sole discretion.</span><br />
            </div>

            <h5>11. Loan Charges</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>If a law that applies to your loan and sets maximum loan charges is finally interpreted so that the interest or other loan charges collected or to be collected in connection with your loan exceed the permitted limits, then: (a) any such loan charge shall be reduced by the amount necessary to reduce the charge to the permitted limit; and (b) any sums already collected from you that exceeded permitted limits will be refunded to you. We may choose to make this refund by reducing the principal owed under the Note or by making a direct payment to you.</span><br />
            </div>

            <h5>12. Other Borrower Obligations</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You agree that the loan proceeds will be used to satisfy a security deposit or related security or deposit obligation incurred by you in connection with your entering into a lease for real property (the “Purpose”) and for no other purpose. You agree that you (A) are a US citizen or permanent resident and (B) did not and will not, in connection with your loan application: (i) make any false, misleading or deceptive statements or omissions of fact in your application; (ii) misrepresent your identity, or describe, present or portray yourself as a person other than yourself; (iii) use any of the loan proceeds to fund any post-secondary educational expenses, including, but not limited to, tuition, fees, books, supplies, miscellaneous expenses, or room and board. You acknowledge and agree that we may rely without independent verification on the accuracy, authenticity, and completeness of all information you provide to us. You certify that the proceeds of the loan will not be used for the purpose of purchasing or carrying any securities or to fund any illegal activity.</span><br />
            </div>
      
            <h5>13. Fees</h5>
            <div>
              <ul>
                <li>Origination Fee. If applicable, you agree to pay a non-refundable Origination Fee to us, as set forth in Loan Terms above. This fee will be deducted from your loan proceeds, so the amount given to you directly or on your behalf will be less than the full principal amount of your loan. You acknowledge that the Origination Fee will be considered part of the principal on your loan and is subject to the accrual of interest.</li>
                <li>Returned Check or ACH Fee. If ACH transfers or checks are returned or fail due to insufficient funds in your account or for any other reason, we may charge you a fee in the amount of $15, or the maximum amount allowable under applicable law, whichever is lesser. Each attempt to collect a payment is considered a separate transaction, so an unsuccessful payment fee may be assessed for each failed attempt. The bank that holds your designated account may assess its own fee in addition to the fee we assess.</li>
                <li>Late Fee. If your payment is not received by us within three days of the due date, we may charge a late fee in the amount of $15, or the maximum amount allowable under applicable law, whichever is lesser. We will charge only one late fee on each late payment. These fees may be collected using ACH transfers initiated by us from your designated account. Any such late fee assessed is immediately due and payable. Any payment received after 6:00 P.M., Pacific Standard Time, on a banking day is deemed received on the next succeeding banking day.</li>
              </ul>
            </div>

            <h5>14. Default</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You will be deemed in default on your loan (each, an “Event of Default”) if you: (1) fail to pay timely any amount due on your loan; (2) file or have instituted against you any bankruptcy or insolvency proceedings or make any assignment for the benefit of creditors; (3) die; (4) commit fraud or make any material misrepresentation in this Agreement, or any other documents, applications or related materials delivered to us in connection with your loan; or (5) fail to abide by the terms of this Agreement.</span><br />
            </div>

            <h5>15. Collection &amp; Reporting of Delinquent Loans</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>{`You agree to pay all costs of collecting any delinquent payments, as permitted by applicable law, including, if we file suit in court, reasonable attorneys' fees for an attorney who is not our salaried employee if and to the greatest extent permissible under applicable law. We may report information about your account to credit bureaus. Late payments, missed payments, or other defaults on your account may be reflected in your credit report.`}</span><br />
            </div>
            
            <h5>16. Remedies</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>Upon the occurrence of an Event of Default, and after any notice and opportunity to cure the default, if such notice and right to cure is required by applicable law, we may exercise all remedies available to us under applicable law and this Agreement, including:</span><br />

              <ol type="a">
                <li>We may require you to immediately pay us, subject to any refund required by law, the remaining unpaid balance of the amount financed, finance charges and all other agreed charges.</li> 
                <li>Except when prohibited by law, we may sue you for additional amounts if we are unable to collect all of the amounts you owe us.</li>
                <li>We may sell your loan to a collection agency, which agency may exercise any remedies available under applicable law to collect amounts due under your loan.</li>
                <li>To the maximum amount permitted by law, we may capitalize any unpaid interest on your loan, in which case the amount of such unpaid interest will be added to the principal balance of your loan and will accrue interest pursuant to the terms and conditions of this Agreement.</li>
                <li>Any other remedy available under applicable law.</li>
              </ol>
          
              <span>By choosing any one or more of these remedies, we do not waive our right to later use another remedy. By deciding not to use any remedy, we do not give up our right to consider the event a default if it happens again.</span><br /><br />

              <span>You agree that if any notice is required to be given to you in connection our exercise of any remedy upon an Event of Default, notice is reasonable if mailed to your last known address, as reflected in our records, at least 10 days before the date such remedy is exercised (or such other period of time as is required by law).</span><br /><br />
            </div>

            <h5>17. Obligations Independent</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>Each person who signs this Agreement agrees to pay this Agreement according to its terms. This means the following:</span><br />

              <ol type="a">
                <li>You must pay this Agreement even if someone else has also signed it.</li> 
                <li>We may release any co-buyer or guarantor and you will still be obligated to pay this Agreement.</li>
                <li>If we give up any of our rights, it will not affect your duty to pay this Agreement unless we have explicitly agreed as much in writing.</li>
                <li>If we extend new credit or renew this Agreement, it will not affect your duty to pay this Agreement unless we have explicitly agreed as much in writing.</li>
              </ol>
            </div>

            <h5>18. Communications Consent:</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You agree that we and any of our affiliates, agents, service providers or assignees (and any of our assignee’s affiliates, agents or service providers) may call you, leave you a voice prerecorded, or artificial voice message, or send you a text, e-mail, or other electronic message for any purpose related to the servicing and collection of your loan, for surveys or research or for any other informational purpose related to your loan (each a “Communication”).You agree that we and any of our affiliates, agents, service providers or assignees (and any of our assignee’s affiliates, agents or service providers) may call or text you at any telephone number associated with your loan, including cellular telephone numbers, and may send an e-mail to any email address associated with your loan. You also agree that we and any of our affiliates, agents, service providers or assignees (and any of our assignee’s affiliates, agents or service providers) may include your personal information in a Communication and may conduct a Communication using an automatic telephone dialing system. We will not charge you for a Communication, but your data service provider may. You agree that you are not required to consent to receipt of such Communications in order to obtain your loan and that you may revoke this consent by contacting us by calling [_________], writing to us at [_________], or by communicating with us in any other reasonable method that gives us a reasonable opportunity to update our records.  In addition, you understand and agree that we and any of our affiliates, agents, service providers or assignees (and any of our assignee’s affiliates, agents or service providers) may always communicate with you in any manner permissible by law that does not require your prior consent.</span><br />
            </div>

            <h5>19. Assignment of Your Loan & Servicing Rights to Your Loan.</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You may not assign, transfer, sublicense or otherwise delegate your rights or obligations under this Agreement to another person. Any such purported assignment, transfer, sublicense or delegation by you in violation of this paragraph shall be null and void.  You agree that we may, without further prior notice to or consent from you, except where required by applicable law, assign any or all of our right, title and interest in this Agreement and your loan, including record of this loan, the debt incurred, any transfer of the obligation and your promise to repay, to anyone. Any such assignee or its agents or designees shall maintain at one of its offices  a copy of each assignment delivered to it and a register for the recordation of the name and address of the holder of your loan (including any assignee, if any, who becomes the holder of your loan pursuant to an assignment), and principal amounts (and stated interest) of your loan or loans owing to, such holder pursuant to the terms hereof from time to time (the “Register”). The entries in the Register shall be conclusive absent manifest error, and you, we and our agents or designees, and the holder of your loan (including any assignee, if any, who becomes the holder of your loan pursuant to an assignment) shall treat the person whose name is recorded in the Register pursuant to the terms hereof as a holder of your loan hereunder for all purposes of this Agreement. Recordation in the Register is the sole means of assignment or transfer of the holder’s (or its assignee’s) interest in your loan. The Register shall be available for inspection by you and any holder (including assignees), at any reasonable time and from time to time upon prior written notice from you. You agree that, subject to any requirements under applicable law (including requirements relating to the provision of notice to or the receipt of consent from you), we may assign and transfer our rights and obligations to service your loan to one or more third parties.</span><br />
            </div>

            <h5>20. Entire Agreement</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>This Agreement represents the entire agreement between you and us regarding the subject matter hereof and supersedes all prior or contemporaneous communications, promises and proposals, whether oral, written or electronic, between us with respect to your application and loan. </span><br />
            </div>

            <h5>21. Electronic Transactions</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>THIS AGREEMENT IS FULLY SUBJECT TO YOUR CONSENT TO ELECTRONIC TRANSACTIONS AND DISCLOSURES, WHICH YOU AGREED TO AT THE TIME OF YOUR APPLICATION. YOU EXPRESSLY AGREE THAT THIS AGREEMENT IS A “TRANSFERABLE RECORD” FOR ALL PURPOSES UNDER THE ELECTRONIC SIGNATURES IN GLOBAL AND NATIONAL COMMERCE ACT AND THE UNIFORM ELECTRONIC TRANSACTIONS ACT.</span><br />
            </div>

            <h5>22. Notices</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>All notices and other communications to you hereunder may be given by email to your email address on file with us or by regular mail to your address on file with us, and shall be deemed to have been duly given and effective upon transmission. You acknowledge that you have sole access to the email account on file with us, and that communications from us may contain sensitive, confidential, and collections-related communications. If your email address changes, you must notify us of the change. You also agree to update your residence address and telephone number if they change. </span><br />
            </div>

            <h5>23. NO WARRANTIES</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, WE MAKE NO REPRESENTATIONS OR WARRANTIES TO YOU, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.</span><br />
            </div>

            <h5>24. LIMITATION ON LIABILITY</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>IN NO EVENT SHALL WE BE LIABLE TO YOU FOR ANY LOST PROFITS OR SPECIAL, EXEMPLARY, CONSEQUENTIAL OR PUNITIVE DAMAGES, EVEN IF INFORMED OF THE POSSIBILITY OF SUCH DAMAGES. FURTHERMORE, WE MAKE NO REPRESENTATION OR WARRANTY TO YOU REGARDING THE EFFECT THAT THE AGREEMENT MAY HAVE UPON YOUR FOREIGN, FEDERAL, STATE OR LOCAL TAX LIABILITY.</span><br />
            </div>

            <h5>25. Waiver of Demand</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>You hereby waive demand, notice of non-payment, protest, and all other notices or demands whatsoever.</span><br />
            </div>

            <h5>26. Amendments</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>Any changes to this Agreement must be in writing signed by you and us.</span><br />
            </div>

            <h5>27. Miscellaneous</h5>
            <div style={{paddingLeft: '20px'}}>
              <span>The parties acknowledge that there are no third party beneficiaries to this Agreement.  We are incorporated in the state of Delaware. The provisions of this Agreement will be governed by federal laws and, to the extent that state law applies, the laws of the state of Delaware, without regard to any principle of conflicts of laws that would require or permit the application of the laws of any other jurisdiction. Any waiver of a breach of any provision of this Agreement will not be a waiver of any other subsequent breach. Failure or delay by either party to enforce any term or condition of this Agreement will not constitute a waiver of such term or condition.  If at any time after the date of this Agreement, any of the provisions of this Agreement shall be held by any court of competent jurisdiction to be illegal, void or unenforceable, such provision shall be of no force and effect, but the illegality and unenforceability of such provision shall have no effect upon and shall not impair the enforceability of any other provisions of this Agreement, other than as specifically provided in paragraph 28(d).  The headings in this Agreement are for reference purposes only and shall not affect the interpretation of this Agreement in any way.</span><br />
            </div>

            <h5>28. Arbitration</h5>
            <div style={{paddingLeft: '20px'}}>
              <ol type="a">
                <li>This arbitration provision in this paragraph 28 (the “Arbitration Provision”) is part of your Agreement.  When you sign the Agreement, you agree to this Arbitration Provision and we agree to it when we disburse the loan.  Arbitration resolves disputes between parties without a lawsuit in court.  BY SIGNING THIS AGREEMENT, YOU WAIVE ANY RIGHT TO A JURY TRIAL OF ALL CLAIMS AND DISPUTES COVERED BY THIS ARBITRATION PROVISION.</li> 
                <li>Covered Claims.  Except for Excluded Claims (discussed below), AT THE ELECTION OF EITHER YOU OR US, YOU AND WE AGREE TO ARBITRATE ALL DISPUTES AND CLAIMS BETWEEN US ON AN INDIVIDUAL BASIS.  “You”, “we” and “us” include our respective subsidiaries, affiliates, agents, employees, predecessors, successors and assigns.  This agreement to arbitrate is intended to be broad, and includes, but is not limited to, any claim, dispute, or controversy (whether based upon contract, tort, intentional or otherwise, constitution, statute, common law, or equity and whether pre-existing, present or future), including initial claims, counterclaims, cross-claims and third party claims, arising from or relating to: this Agreement; the loan evidenced by this Agreement; any insurance, contract, or warranty purchased in connection with this Agreement; whether the claim or dispute must be arbitrated; the validity and enforceability of this Arbitration Provision and this Agreement; the closing, servicing, collection, or enforcement of this Agreement; or the relationships that result from this Agreement (“Claim”).  All Claims shall be resolved, at either your election or our election, by binding arbitration under this Arbitration Provision and the Commercial Dispute Resolution Procedures and Supplementary Procedures for Consumer-Related Disputes of the American Arbitration Association (“AAA”); provided, that if the AAA is unavailable or unwilling to serve as administrator of any arbitration, a substitute administrator shall be selected by either (a) mutual agreement of the parties, or (b) if you and we cannot agree, by a court at the request of either party.  You and we retain the right to seek relief in small claims court so long as the Claim is pending only in that court, the Claim is within the scope of the court’s jurisdiction and the relief is sought on an individual basis.  This Arbitration Provision does not stop you from bringing Claims to the attention of federal, state or local regulators.</li>
                <li>Excluded Claims.  Some claims are excluded from the arbitration process so that you may not elect arbitration.  These claims are called “Excluded Claims” and are described in this section.  We may exercise lawful self-help remedies and we may proceed in court for garnishment, repossession, replevin and foreclosure remedies.  In any court proceeding, you may assert any defenses you have to the Excluded Claims, but any claim or counterclaim, cross-claim, or third-party claim, or claim you have for rescission or damages, must be arbitrated.  If we exercise self-help or judicial remedies as described in this section, we do not waive our arbitration rights for other claims.</li>
                <li>No Class Actions, etc.  YOU AND WE AGREE THAT THE ARBITRATOR ONLY MAY RESOLVE THE CLAIMS, DISPUTES, AND CONTROVERSIES BETWEEN YOU AND US.  YOU AND WE SPECIFICALLY AGREE THAT ARBITRATION IS NOT AVAILABLE AND SHALL NOT BE CONDUCTED ON A CLASS-WIDE BASIS AND THAT THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON’S CLAIMS OR PRESIDE OVER ANY FORM OF REPRESENTATIVE OR CLASS PROCEEDING.  YOU AGREE NOT TO PARTICIPATE IN A REPRESENTATIVE CAPACITY OR AS A MEMBER OF ANY CLASS OF CLAIMANTS PERTAINING TO ANY CLAIM.  IF ANY QUESTION IS RAISED RELATING TO WHETHER CLASS ACTIONS OR CONSOLIDATED ACTIONS ARE PERMITTED, THE ARBITRATOR IS NOT AUTHORIZED TO DECIDE THAT QUESTION AND THAT QUESTION MUST BE RESOLVED BY A COURT.  If this subparagraph cannot be enforced, then this entire Arbitration Provision shall be null and void.</li>
                <li>30 Days to Resolve Claims.  Before you start an arbitration, you agree to write to us at [__________] (or other address that we have notified you about) and give us a reasonable opportunity to resolve your Claim.  Your letter must tell us your name and loan number, describe your Claim, including the dollar amount of your Claim, and describe any other information you need from us.  Before we start an arbitration, we must write to you at your address on this Agreement (or any changed address that you have told us about in writing), describe our Claim, including the dollar amount of our Claim, and give you a reasonable opportunity to resolve the Claim.  If you and we do not resolve the Claim within 30 days after one of us receives notice of a Claim from the other, either you or we can start arbitration.  Neither of us will disclose the amount of any settlement offer made during this 30 day period until after the arbitrator determines the amount, if any, to which you or we are entitled.</li>
                <li>Arbitration Procedure.  The party starting the arbitration will file a claim with the AAA (or any substitute arbitration administrator, as provided by paragraph 28(b)).  The arbitrator must be a lawyer with more than 10 years’ experience or a retired or former judge.  You may obtain the rules and forms of the AAA by writing, calling or e-mailing as follows: American Arbitration Association, 335 Madison Avenue, Floor 10, New York, New York 10017, 800-778-7879, www.adr.org.  If a substitute arbitration administrator is appointed we will ensure that you have contact information for such substitute administrator so that you may obtain any applicable rules and forms.</li>
                <li>Location.  The arbitration will take place in the county where you live.  If you and we agree, the arbitration can take place in another location or it can be conducted by telephone.</li>
                <li>Costs.  After we receive notice at our address provided above (or other address that we have notified you about) that you have started arbitration, we will reimburse you promptly for the filing fee you paid.  If you are not able to pay the filing fee, we will pay it after we receive your written request at our address at the top of this Agreement (or other address that we have notified you about).  We will pay the remaining costs of arbitration and the arbitrator’s fees.  You and we will pay our respective attorney’s fees and witness and experts’ expenses, except as otherwise provided by law or this Arbitration Provision.  If a law gives you the right to recover any of these fees from us, these rights apply in the arbitration.  If the arbitrator issues an award in our favor, you don’t need to reimburse us for any fees we paid to the arbitration administrator or for which we are responsible.</li>
                <li>Conduct of Arbitration.  The arbitrator is bound by the Federal Rules of Evidence, but federal and state rules of procedure or discovery shall not bind the arbitrator.  The arbitrator’s findings, reasoning, decision, and award must be in writing and must be based upon and consistent with the law of the jurisdiction that applies to this Agreement.  The arbitrator must abide by all applicable laws protecting the attorney-client privilege, the attorney work product doctrine, and any other privileges.  You and we agree that any award shall be kept confidential.</li>
                <li>Appeals.  The arbitrator’s decision is final (except for the right to appeal described in this Arbitration Provision), binding, and enforceable in any court having jurisdiction over the parties and the Claim.  Either party may appeal any award of more than $100,000 at its own cost, except as provided by law, to a 3-arbitrator panel appointed by the AAA (or any substitute arbitration administrator, as provided by paragraph 28(b)).  The panel will reconsider any part of the award that either you or we assert was incorrectly decided.  The decision of the panel shall be by majority vote and shall be final and binding, except that the arbitrator’s (or panel’s) findings, decision, and award shall be subject to judicial review on the grounds set forth in 9 U.S.C. § 10, as well as on the grounds that the findings, decision, and award are manifestly inconsistent with the terms of this Arbitration Provision and applicable law.</li>
                <li>Other Agreements.  You and we agree that:  this Arbitration Provision does not affect any statute of limitations or claims of privilege recognized at law; the credit and insurance transactions between you and us are transactions involving interstate commerce, using funds and other resources from outside the state; the Federal Arbitration Act applies to and governs this Arbitration Provision and state arbitration laws and procedures shall not apply to this Arbitration Provision; this Arbitration Provision supersedes any prior arbitration agreement that may exist between you and us and can only be modified in writing signed by you and us; this Arbitration Provision applies even if your loan has been cancelled, changed, modified, refinanced, paid in full, charged off, or discharged or modified in bankruptcy.  If any portion of this Arbitration Provision (other than paragraph 28(d) titled No Class Actions, etc.) cannot be enforced, the rest of this Arbitration Provision will continue to apply.  If paragraph 28(d) titled No Class Actions, etc. cannot be enforced, then the entire Arbitration Provision shall be null and void.</li>
                <li>Rejection of Arbitration Agreement.  You may reject this arbitration agreement by sending us a rejection notice that we receive at [_________] (and no other location) within 60 days after the date of this Agreement.  You must sign any rejection notice and you must include your name, address, telephone number and loan number.  This is the only method you can use to reject this Arbitration Provision.</li>
              </ol>
            </div>
          </div>
          <br />
          <Divider />
          <div style={{textAlign: 'center'}}>
            <h2>Signatures</h2>
          </div>
          <div>
            <span>By signing, or otherwise authenticating, as Borrower, you agree to the terms of the Agreement.</span><br /><br />
              
            <span>CAUTION: IT IS IMPORTANT THAT YOU THOROUGHLY READ THE AGREEMENT BEFORE YOU SIGN IT.</span>

            <Field name="signature" fullWidth={true} component={TextField} type="text" hintText="Signature" floatingLabelText="Signature"/> 
            <div style={{textAlign: 'right'}}>
              <span>Signature Date: {moment().format('MMMM Do, YYYY')}</span>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '20px'}}>
            <RaisedButton style={{width: '65%'}} label="Sign Loan Agreement" primary={true} type="submit"/>
          </div>
        </Paper>
      </form>
    </div>
  );
}

export default reduxForm({
  form: 'sign'
})(SignForm);
