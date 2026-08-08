let checkInDate = document.getElementById('checkIn');
let checkOutDate = document.getElementById('checkOut');
let totalPrice = document.getElementById('totalPrice');

checkInDate.addEventListener('change', () => {
    if(this.value) {
        checkOutDate.min = this.value + 1;

        if(checkOutDate.value && checkOutDate.value <= this.value) {
            checkOutDate.value = '';
        }
    }else {
        checkOutDate.removeAttribute('min');
    }
    
});

checkOutDate.addEventListener('change', () => {
    if(this.value) {
        checkInDate.max = this.value - 1;
    }else {
        checkInDate.removeAttribute('max');
    }
});

let totalNights = Math.abs((checkOutDate.valueAsDate - checkInDate.valueAsDate) / (1000 * 60 * 60 * 24));
totalPrice.textContent = ` &#8377; ${(listing.price * totalNights).toLocaleString("en-IN")} for ${totalNights} night(s)`;