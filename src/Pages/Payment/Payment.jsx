import React from 'react'
import {useNavigate} from 'react-router-dom'

export const Payment = () => {
    const navigate = useNavigate();
    return (
        <>
            <div class="tw-m-10 tw-shadow-lg tw-max-w-md tw-mx-auto">
                <div>
                    <div class="tw-mt-4 tw-rounded tw-bg-white tw-py-6 tw-shadow-lg">
                        <div class="tw-px-6">
                            <div class="tw-flex tw-items-end">
                                <h2 class="tw-text-lg tw-py-3 tw-font-medium">Payment Summary</h2>
                            </div>
                            <div class="tw-flex tw-items-end">
                                <span class="tw-text-sm tw-font-semibold">Great Step Participation Fee</span>
                                <span class="tw-ml-auto tw-text-sm tw-font-semibold">₹ 900</span>
                            </div>
                            <span class="tw-mt-2 tw-text-xs tw-text-gray-500">TMES IIT Kharagpur</span>
                        </div>
                        <div class="tw-mt-4 tw-px-8">
                            {/* <div class="tw-flex tw-items-end tw-justify-between">
                                <span class="tw-text-sm tw-font-semibold">Tax</span>
                                <span class="tw-mb-px tw-text-sm tw-text-gray-500">10%</span>
                            </div> */}
                        </div>
                        <div class="tw-mt-4 tw-border-t tw-px-8 tw-pt-4">
                            <div class="tw-flex tw-items-end tw-justify-between">
                                <span class="tw-font-semibold">Total</span>
                                <span class="tw-font-semibold">₹ 900</span>
                            </div>
                            <span class="tw-mt-2 tw-text-xs tw-text-gray-500">One time fees(Non-Refundable)</span>
                        </div>
                        <div class="tw-mt-8 tw-flex tw-items-center tw-px-8">
                            <input id="termsConditions" type="checkbox" />
                            <label class="tw-ml-2 tw-text-xs tw-text-gray-500" for="termsConditions">I agree to the terms and conditions.</label>
                        </div>
                        <div class="tw-flex tw-flex-col tw-px-8 tw-pt-4">
                            <a href="https://forms.gle/6kMQ9PFNZSnPNzFB9"  target="_blank" className="tw-flex tw-h-10 tw-w-full tw-items-center tw-justify-center tw-rounded tw-bg-blue-600 tw-text-sm tw-font-medium tw-text-blue-50 hover:tw-bg-blue-700">Proceed to Pay</a>
                            {/* <button className="tw-mt-3 tw-text-xs tw-text-blue-500 tw-underline">Have a coupon code?</button> */}
                        </div>
                        <div class="tw-mt-8 tw-px-8">
                            <h2 class="tw-mb-2 tw-text-lg tw-font-semibold tw-text-gray-900">Note:</h2>
                            <ul class="tw-max-w-md tw-space-y-1 tw-text-sm tw-text-gray-500 tw-list-disc tw-list-inside">
                                <li>
                                    You will receive a payment verification mail in <b>12 hours</b>
                                </li>
                                <li>
                                    If you feel any problem, Contact: <a href='mailto:greatstept@gmail.com'>greatstept@gmail.com</a> or from about page
                                    {/* support@tmesiitkgp.in */}
                                </li>
                                {/* <li>
                                    Already Paid ? Check your status here: <span className= "tw-cursor-pointer tw-text-blue-500"onClick={()=>{navigate('/profile')}}>Profile</span>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
