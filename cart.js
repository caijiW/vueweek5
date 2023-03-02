const { createApp } = Vue;

import productModalComponent from "./productModalComponent.js";

// 表單規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

  // 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  //validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = createApp({
    data(){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2/',
            path: 'caiji_hexschool',
            products:[],
            tempProduct:{},
            carts:[],
            formOrder:{
                user:{  
                name:'',
                email:'',
                tel:'',
                address:'',
            },
            message:'',
            },
            
            loader:null,
            loadingId:'',
            updataloadingId:'',
            delloadingId:'',
            delCartLoading:false
        }
    },
    methods:{
        getPorductsList(){
            axios.get(`${this.url}api/${this.path}/products`)
            .then((res) => {
                console.log(res);
                this.products = res.data.products;
                this.loader.hide();
            })
            .catch((err) => {
                console.log(err);
            })
        },
        openProductModal(product){
            //console.log(this.$refs.modal.productModal);
            //this.$refs.modal.show();
            this.delloadingId=product.id;
            this.tempProduct=product;
            this.$refs.modal.productModal.show();
            this.delloadingId='';
            console.log(this.tempProduct);
        },
        addToCart(id,qty=1){
           this.loadingId=id;
            const data ={
                product_id:id,
                qty
            };
            console.log(data);

            axios.post(`${this.url}api/${this.path}/cart`,{data})
            .then((res) => {
                console.log(res);
                this.loadingId='';
                this.getCartList();
                this.$refs.modal.productModal.hide();
            })
            .catch((err) => {
                console.log(err);
            })
        },
        getCartList(){
            axios.get(`${this.url}api/${this.path}/cart`)
            .then((res) => {
                console.log(res);
                //console.log(res.data.data.carts);
                this.carts=res.data.data;
                //console.log('購物車',this.carts);
            })
            .catch((err) => {
                console.log(err);
            })
        },
        delCartItem(cartId){
            this.loadingId=cartId;
            
            axios.delete(`${this.url}api/${this.path}/cart/${cartId}`)
            .then((res) => {
                console.log(res);
                this.loadingId='';
                this.getCartList();
            })
            .catch((err) => {
                console.log(err);
            })
        },
        delCart(){
            this.delCartLoading=true;
            axios.delete(`${this.url}api/${this.path}/carts`)
            .then((res) => {
                console.log(res);
                this.delCartLoading=false;
                this.getCartList();
            })
            .catch((err) => {
                console.log(err);
            })
        },
        updateCartItem(item){
           
           this.updataloadingId=item.product.id;
            const data = {
                product_id:item.product.id,
                qty:item.qty
            }
            //console.log('購物車id',item.id);
            //console.log('產品id',item.product.id)
           
            axios.put(`${this.url}api/${this.path}/cart/${item.id}`,{data})
            .then((res) => {
                console.log(res);
                this.updataloadingId='';
                this.getCartList();
            })
            .catch((err) => {
                console.log(err);
            })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
          },
          createOrder(){
            console.log('送出表單',this.user);
            
            const data = {
                ...this.formOrder
            }
            console.log(data);
            axios.post(`${this.url}api/${this.path}/order`,{data})
            .then((res) => {
                console.log(res);
                this.$refs.form.resetForm();
                this.getCartList();
            
            })
            .catch((err) => {
                console.log(err);
            })
        }
    },
    mounted(){
        this.loader=this.$loading.show();
        this.getPorductsList();
        this.getCartList();
        //this.openProductModal();
        //console.log(this.$refs);
        //console.log(VueLoading);
        
    }
})

// 註冊modal元件
app.component('productModal',productModalComponent);
// 註冊表單驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
// loading-overlay
app.use(VueLoading.LoadingPlugin);

app.mount('#app');