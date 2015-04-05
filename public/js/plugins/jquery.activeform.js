/*
 * Active Form - jQuery plugin for actively validating forms
 *
 * Copyright (c) National Journal
 *
 * 
 * NOTE:
 *  expects html structure 
 * <form>
 *  <fieldset>
 *      <label>
 *      <input>
 *  </fieldset>
 * ...
 * <fieldset>
 *      <input type="submit" value="save" class="save noreset">
 *      <input type="submit" value="reset" class="reset noreset"> (optional)
 *  </fieldset>
 * </form>
 * 
 */
(function($) {
	

    $.fn.activeForm = function(options){
    	var opts = options || {};
    	var self = this;
    	
    	/***
		 * @function: self.reset
		 * @return: void 
		 * @description: reset form to empty values 
		 */
    	this.reset = function(){
    		var $this = $(this);
    		
	      	$this.find('input:not(.noreset,[type=checkbox],[type=radio])').each(function(){
	            $(this).val('');
	            self.removeError( $(this) );
	        });
	        
	        $this.find('input[type=checkbox]:not(.noreset),input[type=radio]:not(.noreset)').each(function(){
	            $(this).removeAttr('checked');
	            self.removeError( $(this) );
	        });
	        
	        $this.find('select:not(.noreset)').each(function(){
	            $(this).val( $(this).find('option:first').val() );
	            self.removeError( $(this) );
	        }); 
	    };

		/***
		 * @function: self.handleRequiredField
		 * @var: $el jQuery object
		 * @return: bool 
		 * @description: check field is not empty
		 * if empty add error msg
		 * else remove error msg 
		 */
		self.handleRequiredField = function($el){
		    var valid = self.validateRequired($el); 
		    if ( valid )
		        self.removeError($el);
		    else
		        self.addError($el, 'This field is required');                    
		    return valid;                
		};
		
		/***
		 * @function: self.handleEmailField
		 * @var: $el jQuery object
		 * @return: bool 
		 * @description: check email is valid
		 * if required field, handle required first
		 * if empty add error msg
		 * else remove error msg 
		 */
		self.handleEmailField = function($el){
		    var valid = true;
		    if ($el.hasClass('required') )
		        valid = self.handleRequiredField( $el );    
		    if (valid)
		        valid = self.validateEmail($el);
		    if ( valid )
		        self.removeError($el);
		    else
		        self.addError($el, 'This is not a valid email');                    
		    return valid;                
		};
		
		/***
		 * @function: self.addError
		 * @var: $el jQuery object
		 * @var: msg string
		 * @return: void 
		 * @description: 
		 * adds error class to parent fieldset
		 * adds error to current input
		 * appends error message to fieldset
		 */
		self.addError = function($el, msg){
		    $el.addClass('error');
		    var $fieldset = $el.parents('fieldset:first');
		    if ($fieldset.length){
		        $fieldset.addClass('error');                    
		        if (msg && $fieldset.find('.errMsg').length == 0)
		            $fieldset.append( '<div class="errMsg">'+msg+'</div>' );
		    }
		};
		
		/***
		 * @function: self.removeError
		 * @var: $el jQuery object
		 * @return: void 
		 * @description: 
		 * removes error class from parent fieldset
		 * removes error from current input
		 * removes appended error message from fieldset
		 */            
		self.removeError = function($el){
		    $el.removeClass('error');
		    var $fieldset = $el.parents('fieldset:first');
		    if ($fieldset.length){
		        $fieldset.removeClass('error');
		        if ($fieldset.find('.errMsg').length)
		            $fieldset.find('.errMsg').remove();
		    }
		};

		/***
		 * @function: self.validateRequired
		 * @var: $el jQuery object
		 * @return: bool 
		 * @description: false if empty or same value as placeholder 
		 */
		self.validateRequired = function($el){
		    var data = $.trim( $el.val() );
		    if ($el.is('select') && data == 'no_selection')
		    	data = '';
		    return ((data.length > 0) && (data != $el.attr('placeholder'))) ;                
		};
		
		/***
		 * @function: self.validateEmail
		 * @var: $el jQuery object
		 * @return: bool 
		 * @description: false if invalid email 
		 */
		self.validateEmail = function($el) { 
		    var email = $.trim( $el.val() );
		    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
		}; 
    	
        return this.each(function() {
            var $this = $(this);
            var selector = $this.attr('id') ? '#'+$this.attr('id') : '.'+$this.attr('class').replace(' ', '.');
            var options = {
                successFn: opts.successFn || null,
                failureEffect: opts.failureEffect || {
                	type: 'shake',
                    times: 4,
                    distance: 20,
                    animation: 500
                }
            };
			
			
			
            /***
             * required on blur, if empty add error msg, else remove errmsg
             */
            $(document).on('blur', selector+' .required', function(){
                self.handleRequiredField( $(this) );                    
            });
            
            /***
             * required on focus, remove error on input
             */
            $(document).on('focus', selector+' .required', function(){
                $(this).removeClass('error');    
            });
            
            /***
             * email on blur, if not valid email add error msg, else remove errmsg
             */
            $(document).on('blur', selector+' .email', function(){
                self.handleEmailField( $(this) );        
            });
            
            /***
             * email on focus, remove error on input
             */
            $(document).on('focus', selector+' .email', function(){
                $(this).removeClass('error');        
            });
            
            /***
             * submit on click, check all fields are valid, 
             * if valid call successfn
             * else inform invalid
             */
            $(document).on('click touchstart', selector+' .save', function(){
            	var valid = true;
                $this.find('.required').each(function(){
                    if ( !self.handleRequiredField( $(this) ) ){
                        valid = false;
                        return;
                    }
                });
                
                if (valid){
                    $this.find('.email').each(function(){
                        if ( !self.handleEmailField( $(this) ) ){
                            valid = false;
                            return;
                        }
                    });
                }
                
                if (valid){
                    if (options.successFn)
                        options.successFn();
                }
                else{
                	if (typeof options.failureEffect == 'function')
                		options.failureEffect();
                	else if (options.failureEffect.type == 'shake' && typeof $this.effect == 'function')
                    	$this.effect( "shake",{times:options.failureEffect.times, distance:options.failureEffect.distance}, options.failureEffect.animation);
                    return false;
                }    
            });
            
            /***
             * reset on click, reset all fields(including error messages) except for no reset fields 
             */
            $(document).on('click touchstart', selector+' .reset', function(){
                self.reset();
            });
      });      
    };
}(jQuery));