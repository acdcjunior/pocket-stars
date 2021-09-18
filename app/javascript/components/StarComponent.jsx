import React from 'react';
import $ from "jquery";

const starDefs = '<defs><filter id="filter-star" x="0" y="0" width="15" height="14.9972" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="-1"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="shape" result="effect1_innerShadow"/></filter><linearGradient id="paint-gradient-linear" x1="0" y1="0" x2="0" y2="14.9972" gradientUnits="userSpaceOnUse"><stop stop-color="#FFCD69"/><stop offset="1" stop-color="#FDCE71"/></linearGradient></defs>';
const starOnSvg = '<svg class="svg-star-on" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter-star)"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.9473 5.66056C14.8302 5.32371 14.5446 5.07474 14.1931 5.02348L10.1582 4.40103L8.35677 0.534568C8.18835 0.219686 7.86614 0 7.5 0C7.13386 0 6.81165 0.219686 6.64323 0.534568L4.8418 4.40103L0.784945 5.02348C0.455417 5.07474 0.169825 5.32371 0.0526597 5.66056C-0.064506 5.99009 0.0160454 6.36356 0.272345 6.61254L3.21613 9.62223L2.51314 13.9061C2.46188 14.2576 2.61566 14.6091 2.89393 14.8288C3.06235 14.9459 3.24542 14.9972 3.45046 14.9972C3.59692 14.9972 3.7507 14.9606 3.90448 14.88L7.5 12.8882L11.0955 14.88C11.2493 14.9606 11.4031 14.9972 11.5495 14.9972C11.7546 14.9972 11.9376 14.9459 12.1061 14.8288C12.3843 14.6091 12.5381 14.2576 12.4869 13.9061L11.7839 9.62223L14.7277 6.61254C14.984 6.36356 15.0645 5.99009 14.9473 5.66056Z" fill="url(#paint-gradient-linear)"/></g></svg>';
const starOffSvg = '<svg class="svg-star-off" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter-star)"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.9473 5.66056C14.8302 5.32371 14.5446 5.07474 14.1931 5.02348L10.1582 4.40103L8.35677 0.534568C8.18835 0.219686 7.86614 0 7.5 0C7.13386 0 6.81165 0.219686 6.64323 0.534568L4.8418 4.40103L0.784945 5.02348C0.455417 5.07474 0.169825 5.32371 0.0526597 5.66056C-0.064506 5.99009 0.0160454 6.36356 0.272345 6.61254L3.21613 9.62223L2.51314 13.9061C2.46188 14.2576 2.61566 14.6091 2.89393 14.8288C3.06235 14.9459 3.24542 14.9972 3.45046 14.9972C3.59692 14.9972 3.7507 14.9606 3.90448 14.88L7.5 12.8882L11.0955 14.88C11.2493 14.9606 11.4031 14.9972 11.5495 14.9972C11.7546 14.9972 11.9376 14.9459 12.1061 14.8288C12.3843 14.6091 12.5381 14.2576 12.4869 13.9061L11.7839 9.62223L14.7277 6.61254C14.984 6.36356 15.0645 5.99009 14.9473 5.66056Z" fill="#E0E0E0"/></g></svg>';

export const $starOnWithDefs = $(starOnSvg.replace('</svg>', starDefs + '</svg>'));
export const $starOffWithDefs = $(starOffSvg.replace('</svg>', starDefs + '</svg>'));
export const $starOn = $(starOnSvg);
export const $starOff = $(starOffSvg);

const StarDefsComponent = () => (
    <defs>
        <filter id="filter-star" x="0" y="0" width="15" height="14.9972" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="-1"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <linearGradient id="paint-gradient-linear" x1="0" y1="0" x2="0" y2="14.9972" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFCD69"/>
            <stop offset="1" stopColor="#FDCE71"/>
        </linearGradient>
    </defs>
)

export const StarComponent = ({ on, defs }) => (
    <svg className="svg-star-off" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter-star)">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M14.9473 5.66056C14.8302 5.32371 14.5446 5.07474 14.1931 5.02348L10.1582 4.40103L8.35677 0.534568C8.18835 0.219686 7.86614 0 7.5 0C7.13386 0 6.81165 0.219686 6.64323 0.534568L4.8418 4.40103L0.784945 5.02348C0.455417 5.07474 0.169825 5.32371 0.0526597 5.66056C-0.064506 5.99009 0.0160454 6.36356 0.272345 6.61254L3.21613 9.62223L2.51314 13.9061C2.46188 14.2576 2.61566 14.6091 2.89393 14.8288C3.06235 14.9459 3.24542 14.9972 3.45046 14.9972C3.59692 14.9972 3.7507 14.9606 3.90448 14.88L7.5 12.8882L11.0955 14.88C11.2493 14.9606 11.4031 14.9972 11.5495 14.9972C11.7546 14.9972 11.9376 14.9459 12.1061 14.8288C12.3843 14.6091 12.5381 14.2576 12.4869 13.9061L11.7839 9.62223L14.7277 6.61254C14.984 6.36356 15.0645 5.99009 14.9473 5.66056Z"
                  fill={ on ? 'url(#paint-gradient-linear)' : '#E0E0E0' }
            />
        </g>
        { defs ? <StarDefsComponent /> : null }
    </svg>
)